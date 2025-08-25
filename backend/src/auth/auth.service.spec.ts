import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  afterEach(() => {
    jest.restoreAllMocks(); // important: clears spyOn calls
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('signed-jwt'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto: RegisterDto = {
        email: 'test@test.com',
        password: '123456',
        firstName: 'John',
        lastName: 'Doe',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: dto.email,
        password: 'hashed',
        firstName: dto.firstName,
        lastName: dto.lastName,
      } as User);

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      const result = await service.register(dto);

      expect(result.success).toBe(true);
      expect(result.data?.user.email).toBe(dto.email);
    });

    it('should fail if email exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
      } as User);

      const dto: RegisterDto = {
        email: 'exists@test.com',
        password: '123456',
        firstName: 'Jane',
        lastName: 'Doe',
      };

      const result = await service.register(dto);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Email already in use');
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const dto: LoginDto = { email: 'test@test.com', password: '123456' };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: dto.email,
        password: 'hashed',
        role: 'BUYER',
      } as User);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(dto);

      expect(result.success).toBe(true);
      expect(result.data?.accessToken).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const dto: LoginDto = { email: 'wrong@test.com', password: 'bad' };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.login(dto);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid credentials');
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens', async () => {
      const mockUser: User & { refreshToken: string } = {
        id: 1,
        email: 'test@test.com',
        password: 'hashed',
        role: 'BUYER',
        refreshToken: 'old-hash',
        uuid: '',
        isEmailVerified: false,
        emailVerificationToken: null,
        passwordResetToken: null,
        lastLogin: null,
        loginAttempts: 0,
        twoFactorEnabled: false,
        twoFactorSecret: null,
        firstName: null,
        lastName: null,
        username: null,
        avatarUrl: null,
        bio: null,
        website: null,
        location: null,
        phone: null,
        dateOfBirth: null,
        permissions: [],
        referredById: null,
        commissionBalance: 0,
        totalCommission: 0,
        preferredCurrency: 'USD',
        locale: 'en',
        darkMode: false,
        notificationsOptIn: true,
        lastActive: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: null,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.refreshTokens(1, 'refresh-token');

      expect(result.success).toBe(true);
      expect(result.data?.accessToken).toBeDefined();
      expect(result.data?.refreshToken).toBeDefined();
    });

    it('should fail if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.refreshTokens(99, 'refresh-token');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Access denied');
    });
  });
});
