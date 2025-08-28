import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/decorators/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { S3FileInterceptor } from 'src/s3/s3-file.interceptor';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
export class FileUploadController {
  constructor(private readonly configService: ConfigService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER', 'ADMIN')
  @UseInterceptors(S3FileInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  uploadFile(@UploadedFile() file: Express.MulterS3.File) {
    if (!file) {
      throw new HttpException(
        { success: false, message: 'No file provided' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      success: true,
      data: {
        filename: file.key,
        url: file.location,
      },
    };
  }
}
