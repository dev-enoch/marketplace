import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Backend')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Check backend status' })
  @ApiResponse({
    status: 200,
    description: 'Backend is running and responding',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
