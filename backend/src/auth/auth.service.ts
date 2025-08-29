import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      return { success: false, message: 'Email already in use' };
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const { password, refreshToken, ...safeUser } = user;
    return { success: true, data: { user: safeUser, ...tokens } };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) return { success: false, message: 'Invalid credentials' };

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) return { success: false, message: 'Invalid credentials' };

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const { password, refreshToken, ...safeUser } = user;
    return { success: true, data: { user: safeUser, ...tokens } };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return { success: false, message: 'User not found' };

    const { password, refreshToken, ...safeUser } = user;
    return { success: true, data: safeUser };
  }

  async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string },
  ) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    const { password, refreshToken, ...safeUser } = user;
    return { success: true, data: safeUser };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, message: 'User not found' };

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return { success: false, message: 'Invalid current password' };

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNew },
    });

    return { success: true, message: 'Password updated successfully' };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken) {
      return { success: false, message: 'Access denied' };
    }

    const matches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!matches) return { success: false, message: 'Access denied' };

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { success: true, data: tokens };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }

  private async getTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
