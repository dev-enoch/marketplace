import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthenticatedUser } from 'src/auth/types/auth-request.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  async getProfile(@Req() req: { user: AuthenticatedUser }) {
    return this.profileService.getProfile(req.user);
  }
}
