import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from 'src/auth/types/auth-request.type';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(user: AuthenticatedUser) {
    const userData = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        avatarUrl: true,
        bio: true,
        website: true,
        location: true,
        phone: true,
        dateOfBirth: true,
        role: true,
        preferredCurrency: true,
        locale: true,
        darkMode: true,
        notificationsOptIn: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userData) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, data: userData };
  }
}
