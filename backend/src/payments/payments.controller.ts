import { Controller, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { FlutterwaveService } from './flutterwave.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly flutterwaveService: FlutterwaveService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initialize a Flutterwave test payment' })
  @ApiBody({ type: InitiatePaymentDto })
  async initiatePayment(@Body() body: InitiatePaymentDto) {
    return this.flutterwaveService.initializePayment(body);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify a Flutterwave payment by transaction ID' })
  @ApiQuery({
    name: 'txId',
    description: 'Transaction ID to verify',
    required: true,
  })
  async verifyPayment(@Query('txId') txId: string) {
    return this.flutterwaveService.verifyPayment(txId);
  }
}
