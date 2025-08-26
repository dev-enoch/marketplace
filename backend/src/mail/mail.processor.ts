import { Process, Processor, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import * as sgMail from '@sendgrid/mail';

@Processor('mail')
export class MailProcessor {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  private async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ) {
    await sgMail.send({
      to,
      from: process.env.MAIL_FROM || 'no-reply@yourapp.com',
      subject,
      text,
      html,
    });
  }

  @Process('purchase')
  async handlePurchase(job: Job) {
    const { to, orderId, items, total } = job.data;
    await this.sendMail(
      to,
      `Order Confirmation #${orderId}`,
      `Thanks for your order #${orderId}. Total: $${total}`,
      `<h1>Order Confirmation</h1><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul><p>Total: $${total}</p>`,
    );
  }

  @Process('renewal')
  async handleRenewal(job: Job) {
    const { to, planName, renewDate } = job.data;
    await this.sendMail(
      to,
      `Your ${planName} subscription renews soon`,
      `Your ${planName} plan will renew on ${new Date(renewDate).toDateString()}.`,
      `<h1>Subscription Renewal</h1><p>Your plan <b>${planName}</b> renews on ${new Date(renewDate).toDateString()}</p>`,
    );
  }

  @Process('cart-abandonment')
  async handleCart(job: Job) {
    const { to, items, discountCode } = job.data;
    await this.sendMail(
      to,
      `You left items in your cart`,
      `You left some items in your cart. Complete your purchase today.`,
      `<h1>Cart Reminder</h1><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>${
        discountCode ? `<p>Use code <b>${discountCode}</b></p>` : ''
      }<a href="${process.env.FRONTEND_URL}/cart">Return to cart</a>`,
    );
  }

  @OnQueueFailed()
  async handleFailure(job: Job, err: Error) {
    console.error(`Job ${job.id} of type ${job.name} failed:`, err.message);
  }
}
