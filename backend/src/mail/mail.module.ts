// mail.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'mail',
      useFactory: async (redisService: RedisService) => {
        const client = redisService.getClient();
        return {
          createClient: () => client,
          defaultJobOptions: {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 5000,
            },
            removeOnComplete: true,
            removeOnFail: 20,
          },
          limiter: {
            max: 20,
            duration: 1000,
          },
        };
      },
      inject: [RedisService],
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
