import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AppConfig } from 'src/config/configuration';

@Injectable()
export class FlutterwaveService {
  private baseUrl = 'https://api.flutterwave.com/v3';
  private secretKey: string;

  constructor(private readonly configService: ConfigService<AppConfig>) {
    const flutterwave =
      this.configService.get<AppConfig['flutterwave']>('flutterwave');
    if (!flutterwave?.secretKey) {
      throw new Error('Missing FLUTTERWAVE_SECRET_KEY in configuration');
    }
    this.secretKey = flutterwave.secretKey;
  }

  async initializePayment({
    amount,
    currency,
    txRef,
    redirectUrl,
    customer,
  }: {
    amount: number;
    currency: string;
    txRef: string;
    redirectUrl: string;
    customer: { email: string; name: string };
  }) {
    const payload = {
      tx_ref: txRef,
      amount,
      currency,
      redirect_url: redirectUrl,
      payment_options: 'card,banktransfer,ussd',
      customer,
    };

    const response = await axios.post(`${this.baseUrl}/payments`, payload, {
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  async verifyPayment(txId: string) {
    const response = await axios.get(
      `${this.baseUrl}/transactions/${txId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      },
    );

    return response.data;
  }
}
