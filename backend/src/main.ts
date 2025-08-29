import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { setupBullBoard } from './queues/bullboard';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));

  const emailQueue = app.get<Queue>(getQueueToken('mail'));
  setupBullBoard(app.getHttpAdapter().getInstance(), [emailQueue]);

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Marketplace API')
      .setDescription('API documentation for Marketplace')
      .setVersion('1.0')
      .addBearerAuth()
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Refresh token',
        },
        'refresh-token',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/documentation', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
