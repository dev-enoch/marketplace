import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { FlutterwaveService } from './flutterwave.service';
import { AppConfig } from '../config/configuration';

describe('FlutterwaveService', () => {
  let service: FlutterwaveService;
  let mockAxios: MockAdapter;

  const mockConfigService = {
    get: jest.fn((key: keyof AppConfig) => {
      if (key === 'flutterwave') {
        return {
          secretKey: 'FLWSECK_TEST-xxxx',
          publicKey: 'FLWPUBK_TEST-xxxx',
          encryptionKey: 'FLWSECK_TEST-xxxx',
        };
      }
      return undefined;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlutterwaveService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<FlutterwaveService>(FlutterwaveService);
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize payment', async () => {
    const mockResponse = {
      status: 'success',
      data: { link: 'https://payment.link' },
    };
    mockAxios
      .onPost('https://api.flutterwave.com/v3/payments')
      .reply(200, mockResponse);

    const result = await service.initializePayment({
      amount: 1000,
      currency: 'NGN',
      txRef: 'tx123',
      redirectUrl: 'https://example.com/redirect',
      customer: { email: 'test@example.com', name: 'John Doe' },
    });

    expect(result).toEqual(mockResponse);
    expect(mockAxios.history.post.length).toBe(1);
    const postData = JSON.parse(mockAxios.history.post[0].data);
    expect(postData.tx_ref).toBe('tx123');
  });

  it('should verify payment', async () => {
    const txId = 'tx123';
    const mockResponse = {
      status: 'success',
      data: { id: txId, status: 'successful' },
    };
    mockAxios
      .onGet(`https://api.flutterwave.com/v3/transactions/${txId}/verify`)
      .reply(200, mockResponse);

    const result = await service.verifyPayment(txId);

    expect(result).toEqual(mockResponse);
    expect(mockAxios.history.get.length).toBe(1);
  });
});
