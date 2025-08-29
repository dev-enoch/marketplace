import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @ApiOperation({ summary: 'Log user/product actions' })
  @ApiResponse({ status: 201, description: 'Action tracked' })
  async trackAction(
    @Req() req,
    @Body() body: { productId?: string; action: string; metadata?: any },
  ) {
    return this.analyticsService.trackAction(req.user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get analytics data (Admin only)' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved' })
  async getAnalytics(@Req() req) {
    return this.analyticsService.getAnalytics(req.user);
  }
}
