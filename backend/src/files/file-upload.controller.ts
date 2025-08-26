import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, DiskStorageOptions, FileFilterCallback } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/decorators/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import type { Request } from 'express';
import type { File as MulterFile } from 'multer';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
export class FileUploadController {
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER', 'ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (
          req: Request,
          file: MulterFile,
          cb: (error: Error | null, destination: string) => void,
        ) => {
          cb(null, join(__dirname, '../../uploads'));
        },
        filename: (
          req: Request,
          file: MulterFile,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      } as DiskStorageOptions),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  uploadFile(@UploadedFile() file: MulterFile) {
    if (!file) {
      throw new HttpException(
        { success: false, message: 'No file provided' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      success: true,
      data: { filename: file.filename, path: file.path },
    };
  }
}
