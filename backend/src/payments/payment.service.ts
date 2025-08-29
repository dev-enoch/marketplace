import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async listPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { order: { userId } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPayment(userId: string, paymentId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id: paymentId, order: { userId } },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }
}
