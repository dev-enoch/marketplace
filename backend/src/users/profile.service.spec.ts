import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from 'src/auth/types/auth-request.type';

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: { user: { findUnique: jest.fn() } },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return user profile', async () => {
    const mockUser: AuthenticatedUser = {
      sub: 1,
      email: 'test@test.com',
      role: 'BUYER',
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@test.com',
    });

    const result = await service.getProfile(mockUser);
    expect(result.success).toBe(true);
    expect(result.data?.email).toBe('test@test.com');
  });

  it('should return error if user not found', async () => {
    const mockUser: AuthenticatedUser = {
      sub: 99,
      email: 'notfound@test.com',
      role: 'BUYER',
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await service.getProfile(mockUser);
    expect(result.success).toBe(false);
    expect(result.message).toBe('User not found');
  });
});
