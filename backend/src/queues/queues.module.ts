import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import Redis from 'ioredis';
import { RedisService } from '../redis/redis.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    RedisModule,
    BullModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: (redisService: RedisService) => {
        const redisOptions = {
          ...redisService.getOptions(),
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
        };

        const client = new Redis(redisOptions);

        return {
          createClient: (type: 'client' | 'bclient' | 'subscriber') => {
            switch (type) {
              case 'client':
                return client;
              case 'bclient':
                return new Redis(redisOptions);
              case 'subscriber':
                return new Redis(redisOptions);
              default:
                return new Redis(redisOptions);
            }
          },
        };
      },
    }),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
