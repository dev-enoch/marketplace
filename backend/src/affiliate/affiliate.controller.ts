import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AffiliateService } from './affiliate.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Affiliate')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Get()
  @ApiOperation({ summary: 'View affiliate dashboard' })
  @ApiResponse({ status: 200, description: 'Affiliate dashboard retrieved' })
  async getDashboard(@Req() req) {
    return this.affiliateService.getDashboard(req.user.id);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Request withdrawal from affiliate balance' })
  @ApiResponse({ status: 200, description: 'Withdrawal requested' })
  async withdraw(@Req() req, @Body() body: { amount: number }) {
    return this.affiliateService.requestWithdrawal(req.user.id, body);
  }

  @Get('referrals')
  @ApiOperation({ summary: 'List affiliate referrals' })
  @ApiResponse({ status: 200, description: 'Referrals retrieved' })
  async referrals(@Req() req) {
    return this.affiliateService.getReferrals(req.user.id);
  }
}
