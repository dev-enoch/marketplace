import {
  Controller,
  Post,
  Get,
  Req,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Checkout & Orders')
@Controller()
@UseGuards(JwtAuthGuard)
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  @Post('checkout')
  @ApiOperation({
    summary: 'Create an order and initialize Flutterwave payment',
  })
  @ApiResponse({ status: 201, description: 'Checkout initialized' })
  createCheckout(@Req() req) {
    return this.checkoutService.createCheckout(req.user.id);
  }

  @Post('checkout/confirm')
  @ApiOperation({ summary: 'Confirm order status (optional)' })
  confirmCheckout(@Req() req, @Body() body: { orderId: string }) {
    return this.checkoutService.confirmCheckout(req.user.id, body.orderId);
  }

  @Post('payments/webhook')
  @ApiOperation({ summary: 'Flutterwave webhook callback' })
  handleWebhook(@Body() payload: any) {
    return this.checkoutService.handleWebhook(payload);
  }

  @Get('orders')
  @ApiOperation({ summary: 'List all orders for the current user' })
  listOrders(@Req() req) {
    return this.checkoutService.listOrders(req.user.id);
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get details of a specific order' })
  getOrder(@Req() req, @Param('id') id: string) {
    return this.checkoutService.getOrder(req.user.id, id);
  }
}
