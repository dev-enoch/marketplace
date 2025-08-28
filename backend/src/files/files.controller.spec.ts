import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadController } from './file-upload.controller';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('FileUploadController', () => {
  let controller: FileUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const values: Record<string, string> = {
                'aws.region': 'us-east-1',
                'aws.accessKeyId': 'fake-access',
                'aws.secretAccessKey': 'fake-secret',
                'aws.s3Bucket': 'test-bucket',
              };
              return values[key];
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<FileUploadController>(FileUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw error when no file is provided', () => {
    expect(() => controller.uploadFile(undefined as any)).toThrow(
      new HttpException(
        { success: false, message: 'No file provided' },
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should return success response when file is provided', () => {
    const mockFile: Express.MulterS3.File = {
      fieldname: 'file',
      originalname: 'test.png',
      encoding: '7bit',
      mimetype: 'image/png',
      size: 1234,
      stream: {} as any,
      destination: '',
      filename: 'file-123.png',
      path: '',
      buffer: Buffer.from(''),
      key: 'file-123.png',
      location: 'https://test-bucket.s3.amazonaws.com/file-123.png',
      bucket: 'test-bucket',
      acl: 'public-read',
      contentType: 'image/png',
      etag: 'etag123',
      metadata: {},
      storageClass: 'STANDARD',
      contentDisposition: null,
      serverSideEncryption: null,
    };

    const result = controller.uploadFile(mockFile);

    expect(result).toEqual({
      success: true,
      data: {
        filename: mockFile.key,
        url: mockFile.location,
      },
    });
  });
});
