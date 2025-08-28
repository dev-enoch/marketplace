import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { multerS3Config } from './multer-config.factory';

@Injectable()
export class S3FileInterceptor implements NestInterceptor {
  private interceptor;

  constructor(private readonly configService: ConfigService) {
    this.interceptor = FileInterceptor('file', {
      storage: multerS3Config(this.configService),
    });
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    return this.interceptor.intercept(context, next);
  }
}
