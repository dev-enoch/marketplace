import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionStatus } from 'generated/prisma';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async initializeSubscription(userId: string, dto: { planId: string }) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: dto.planId },
    });
    if (!plan) throw new NotFoundException('Plan not found');

    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        status: 'PENDING' as SubscriptionStatus,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
      include: { plan: true },
    });

    return subscription;
  }

  async handleWebhook(payload: any) {
    // Flutterwave webhook should include subscription reference
    const { subscriptionId, status } = payload;

    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });
    if (!subscription) throw new NotFoundException('Subscription not found');

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status },
    });
  }

  async listSubscriptions(userId: string) {
    return this.prisma.subscription.findMany({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
