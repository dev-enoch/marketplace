import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async trackAction(
    userId: string,
    payload: { productId?: string; action: string; metadata?: any },
  ) {
    return this.prisma.analytics.create({
      data: {
        userId,
        action: payload.action,
        metadata: payload.metadata,
        productId: payload.productId,
      },
    });
  }

  async getAnalytics(user: { id: string; role: string }) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can view analytics');
    }

    return this.prisma.analytics.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
