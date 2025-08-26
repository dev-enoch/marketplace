import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthenticatedUser } from 'src/auth/types/auth-request.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ProfileDto } from './dto/profile.dto';

@ApiTags('Users')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile returned successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOkResponse({
    description: 'User profile returned successfully',
    type: ProfileDto,
  })
  async getProfile(@Req() req: { user: AuthenticatedUser }) {
    return this.profileService.getProfile(req.user);
  }
}
