import { Module } from '@nestjs/common';
import { FlutterwaveService } from './flutterwave.service';
import { PaymentsController } from './payments.controller';

@Module({
  providers: [FlutterwaveService],
  controllers: [PaymentsController],
  exports: [FlutterwaveService],
})
export class PaymentsModule {}
