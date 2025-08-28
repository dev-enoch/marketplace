import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;

  constructor(private config: ConfigService) {
    const options = this.getOptions();

    this.client = new Redis(options);

    this.client.on('connect', () => console.log('Connected to Redis'));
    this.client.on('error', (err) => console.error('Redis error:', err));
  }

  getOptions(): RedisOptions {
    const host = this.config.get<string>('redis.host');
    const port = this.config.get<number>('redis.port');
    const username = this.config.get<string>('redis.username');
    const password = this.config.get<string>('redis.password');

    if (!host || !port) throw new Error('Redis host or port not defined');

    return { host, port, username, password };
  }

  getClient(): Redis {
    return this.client;
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) await this.client.set(key, value, 'EX', ttl);
    else await this.client.set(key, value);
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async del(key: string) {
    return this.client.del(key);
  }

  onModuleDestroy() {
    this.client.quit();
  }
}
