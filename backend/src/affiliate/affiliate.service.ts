import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AffiliateService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
      include: { referrals: { include: { referredUser: true } } },
    });

    if (!affiliate) {
      return this.prisma.affiliate.create({
        data: { userId },
        include: { referrals: true },
      });
    }

    return affiliate;
  }

  async requestWithdrawal(userId: string, dto: { amount: number }) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
    });
    if (!affiliate)
      throw new BadRequestException('Affiliate account not found');
    if (dto.amount > affiliate.balance) {
      throw new BadRequestException('Insufficient balance');
    }

    // Decrease balance
    await this.prisma.affiliate.update({
      where: { userId },
      data: { balance: { decrement: dto.amount } },
    });

    // TODO: integrate withdrawal request with Flutterwave or other provider

    return { success: true, withdrawn: dto.amount };
  }

  async getReferrals(userId: string) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
      include: { referrals: { include: { referredUser: true } } },
    });

    if (!affiliate)
      throw new BadRequestException('Affiliate account not found');
    return affiliate.referrals;
  }
}
