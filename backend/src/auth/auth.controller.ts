import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { AuthenticatedRequest } from './types/auth-request.type';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Email already in use.' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and get access token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access token.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBearerAuth('refresh-token')
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Refresh token invalid.',
  })
  async refresh(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken!);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Returns authenticated user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async me(@Req() req: AuthenticatedRequest) {
    return this.authService.me(req.user.sub);
  }

  @Put('update-profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() body: { firstName?: string; lastName?: string },
  ) {
    return this.authService.updateProfile(req.user.sub, body);
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change user password' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Password updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(
      req.user.sub,
      body.oldPassword,
      body.newPassword,
    );
  }
}
