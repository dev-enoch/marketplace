import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('initialize')
  @ApiOperation({ summary: 'Initialize a subscription' })
  @ApiResponse({ status: 201, description: 'Subscription initialized' })
  async initialize(@Req() req, @Body() body: { planId: string }) {
    return this.subscriptionService.initializeSubscription(req.user.id, body);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle subscription webhook from Flutterwave' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async webhook(@Body() payload: any) {
    return this.subscriptionService.handleWebhook(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List user subscriptions' })
  @ApiResponse({ status: 200, description: 'User subscriptions retrieved' })
  async list(@Req() req) {
    return this.subscriptionService.listSubscriptions(req.user.id);
  }
}
