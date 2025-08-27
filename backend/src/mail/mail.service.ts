import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private mailQueue: Queue) {}

  async sendPurchaseEmail(
    to: string,
    orderId: string,
    items: string[],
    total: number,
  ) {
    await this.mailQueue.add('purchase', { to, orderId, items, total });
  }

  async sendRenewalEmail(to: string, planName: string, renewDate: Date) {
    await this.mailQueue.add('renewal', { to, planName, renewDate });
  }

  async sendCartAbandonmentEmail(
    to: string,
    items: string[],
    discountCode?: string,
  ) {
    await this.mailQueue.add('cart-abandonment', { to, items, discountCode });
  }
}
