import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';
import { QueuesModule } from '../queues/queues.module';

@Module({
  imports: [QueuesModule, BullModule.registerQueue({ name: 'mail' })],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
