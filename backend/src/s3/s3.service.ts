import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  public s3: S3Client;
  public bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId')!,
        secretAccessKey: this.configService.get<string>('aws.secretAccessKey')!,
      },
    });

    this.bucket = this.configService.get<string>('aws.s3Bucket')!;
  }
}
