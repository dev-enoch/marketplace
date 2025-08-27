import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [RedisService],
      useFactory: (redisService: RedisService) => {
        const client = redisService.getClient();
        return {
          createClient: () => client,
        };
      },
    }),
  ],
})
export class QueuesModule {}
