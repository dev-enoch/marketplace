import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull'; // <-- change here
import type {
  PurchaseEmailDto,
  RenewalEmailDto,
  CartAbandonmentEmailDto,
} from './dto/mail.dto';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private mailQueue: Queue) {}

  async sendPurchaseEmail(dto: PurchaseEmailDto) {
    await this.mailQueue.add('purchase', dto);
  }

  async sendRenewalEmail(dto: RenewalEmailDto) {
    await this.mailQueue.add('renewal', dto);
  }

  async sendCartAbandonmentEmail(dto: CartAbandonmentEmailDto) {
    await this.mailQueue.add('cart-abandonment', dto);
  }
}
