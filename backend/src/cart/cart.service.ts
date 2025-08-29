import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  slug: string;
}

export interface CartLine {
  id: string;
  product: CartProduct;
  quantity: number;
  lineTotal: number;
}

export interface CartData {
  cartId: string;
  userId: string;
  items: CartLine[];
  total: number;
}

export interface CartResponse {
  success: boolean;
  data?: CartData;
  message?: string;
}

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async ensureCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      select: { id: true, userId: true },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        select: { id: true, userId: true },
      });
    }
    return cart;
  }

  async addItem(
    userId: string,
    productId: string,
    quantity = 1,
  ): Promise<CartResponse> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    const cart = await this.ensureCart(userId);

    await this.prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity: { increment: quantity } },
      create: { cartId: cart.id, productId, quantity },
    });

    return {
      ...(await this.getCart(userId)),
      message: 'Item added to cart',
    };
  }

  async updateItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartResponse> {
    const cart = await this.ensureCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
      select: { id: true },
    });
    if (!item) throw new NotFoundException('Item not in cart');

    await this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });

    return {
      ...(await this.getCart(userId)),
      message: 'Item updated',
    };
  }

  async removeItem(userId: string, productId: string): Promise<CartResponse> {
    const cart = await this.ensureCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
      select: { id: true },
    });
    if (!item) throw new NotFoundException('Item not in cart');

    await this.prisma.cartItem.delete({ where: { id: item.id } });

    return {
      ...(await this.getCart(userId)),
      message: 'Item removed',
    };
  }

  async clearCart(userId: string): Promise<CartResponse> {
    const cart = await this.ensureCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return {
      ...(await this.getCart(userId)),
      message: 'Cart cleared',
    };
  }

  async getCart(userId: string): Promise<CartResponse> {
    const cart = await this.ensureCart(userId);

    const items = await this.prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            currency: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    const mapped: CartLine[] = items.map((i) => ({
      id: i.id,
      product: {
        id: i.product.id,
        name: i.product.name,
        slug: i.product.slug,
        price: i.product.price,
        currency: i.product.currency,
      },
      quantity: i.quantity,
      lineTotal: i.quantity * i.product.price,
    }));

    const total = mapped.reduce((acc, l) => acc + l.lineTotal, 0);

    return {
      success: true,
      data: {
        cartId: cart.id,
        userId: cart.userId,
        items: mapped,
        total,
      },
    };
  }
}
