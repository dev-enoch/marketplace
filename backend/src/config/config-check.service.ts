import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './configuration';

@Injectable()
export class ConfigCheckService implements OnModuleInit {
  constructor(private readonly configService: ConfigService<AppConfig>) {}

  onModuleInit() {
    const requiredKeys: Array<keyof AppConfig | string> = [
      'PORT',
      'DATABASE_URL',
      'REDIS_HOST',
      'REDIS_PORT',
      'REDIS_USERNAME',
      'REDIS_PASSWORD',
      'JWT_ACCESS_SECRET',
      'JWT_REFRESH_SECRET',
      'AWS_REGION',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_S3_BUCKET',
      'FLUTTERWAVE_SECRET_KEY',
      'FLUTTERWAVE_PUBLIC_KEY',
      'FLUTTERWAVE_ENCRYPTION_KEY',
    ];

    const missing = requiredKeys.filter((key) => {
      const value = this.configService.get(key as any);
      return value === undefined || value === null || value === '';
    });

    if (missing.length) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }
  }
}
