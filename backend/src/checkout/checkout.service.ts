import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  async createCheckout(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    const payment = await this.prisma.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        provider: 'FLUTTERWAVE',
        status: 'PENDING',
        providerRef: '',
      },
    });

    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref: payment.id,
        amount: totalAmount,
        currency: 'USD',
        redirect_url: process.env.FLW_REDIRECT_URL,
        customer: {
          id: userId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      },
    );

    return {
      success: true,
      orderId: order.id,
      paymentId: payment.id,
      paymentLink: response.data.data.link,
    };
  }

  async confirmCheckout(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) throw new NotFoundException('Order not found');

    // usually this step is redundant since webhook handles it
    return { success: true, status: order.status };
  }

  async handleWebhook(payload: any) {
    const txRef = payload?.data?.tx_ref;
    const status = payload?.data?.status;

    const payment = await this.prisma.payment.findUnique({
      where: { id: txRef },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    const orderId = payment.orderId;

    let paymentStatus = 'FAILED';
    let orderStatus = 'FAILED';

    if (status === 'successful') {
      paymentStatus = 'SUCCESS';
      orderStatus = 'PAID';
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: paymentStatus, transactionId: payload.data.id },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: orderStatus },
    });

    return { success: true };
  }

  async listOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } }, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: { include: { product: true } }, payments: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
