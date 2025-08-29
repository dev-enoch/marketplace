import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { FilesModule } from './files/files.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './products/product.module';
import { QueuesModule } from './queues/queues.module';
import { RedisModule } from './redis/redis.module';
import { RolesGuard } from './common/decorators/guards/roles.guard';
import { UsersModule } from './users/users.module';
import { ConfigCheckService } from './config/config-check.service';
import { PaymentsModule } from './payments/payment.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    AuthModule,
    CartModule,
    FilesModule,
    MailModule,
    PrismaModule,
    ProductModule,
    PaymentsModule,
    QueuesModule,
    RedisModule,
    StripeModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: RolesGuard },
    ConfigCheckService,
  ],
})
export class AppModule {}
