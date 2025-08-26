import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { AuthenticatedRequest } from './types/auth-request.type';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
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
}
