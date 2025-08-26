import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadController } from './file-upload.controller';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/decorators/guards/roles.guard';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

describe('FileUploadController', () => {
  let app: INestApplication;
  const uploadPath = join(__dirname, '../../uploads');

  beforeAll(async () => {
    // Ensure the uploads folder exists
    if (!existsSync(uploadPath)) mkdirSync(uploadPath);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should upload a file successfully', async () => {
    const res = await request(app.getHttpServer())
      .post('/files/upload')
      .attach('file', Buffer.from('test file content'), 'test.txt');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('filename');
    expect(res.body.data).toHaveProperty('path');
  });

  it('should reject upload if file not provided', async () => {
    const res = await request(app.getHttpServer()).post('/files/upload');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('No file provided');
  });
});
