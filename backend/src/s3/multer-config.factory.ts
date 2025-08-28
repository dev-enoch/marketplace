import { ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { extname } from 'path';
import type { Request } from 'express';
import type { StorageEngine } from 'multer';
import type { AppConfig } from '../config/configuration';

export const multerS3Config = (
  configService: ConfigService<AppConfig>,
): StorageEngine => {
  const s3 = new S3({
    region: configService.get('aws.region', { infer: true }),
    credentials: {
      accessKeyId: configService.get('aws.accessKeyId', { infer: true })!,
      secretAccessKey: configService.get('aws.secretAccessKey', {
        infer: true,
      })!,
    },
  });

  return multerS3({
    s3,
    bucket: configService.get('aws.s3Bucket', { infer: true })!,
    acl: 'public-read',
    key: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, key?: string) => void,
    ) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
};
