import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { validationSchema } from './config/validation';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesGuard } from './common/decorators/guards/roles.guard';
import { ProductModule } from './products/product.module';
import { FilesModule } from './files/files.module';
import { APP_GUARD } from '@nestjs/core';
import { QueuesModule } from './queues/queues.module';
import { MailModule } from './mail/mail.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    PrismaModule,
    RedisModule,
    QueuesModule,
    AuthModule,
    UsersModule,
    ProductModule,
    FilesModule,
    MailModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
