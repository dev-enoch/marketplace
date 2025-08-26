import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedRequest } from './types/auth-request.type';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            refreshTokens: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'ACCESS_TOKEN_SECRET') return 'access-secret';
              if (key === 'REFRESH_TOKEN_SECRET') return 'refresh-secret';
              return null;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should call service.register and return result', async () => {
      const dto: RegisterDto = {
        email: 'test@test.com',
        password: '123456',
        firstName: 'John',
        lastName: 'Doe',
      };

      (service.register as jest.Mock).mockResolvedValue({
        success: true,
        data: {},
      });

      const result = await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('login', () => {
    it('should call service.login and return result', async () => {
      const dto: LoginDto = { email: 'test@test.com', password: '123456' };

      (service.login as jest.Mock).mockResolvedValue({
        success: true,
        data: {},
      });

      const result = await controller.login(dto);

      expect(service.login).toHaveBeenCalledWith(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens', async () => {
      const req = {
        user: { sub: 1, refreshToken: 'refresh-token' },
      } as Partial<AuthenticatedRequest>;

      jest.spyOn(service, 'refreshTokens').mockResolvedValue({
        success: true,
        data: { accessToken: 'access-token', refreshToken: 'refresh-token' },
      });

      const result = await controller.refresh(req as AuthenticatedRequest);

      expect(service.refreshTokens).toHaveBeenCalledWith(1, 'refresh-token');
      expect(result.success).toBe(true);
      expect(result.data?.accessToken).toBe('access-token');
      expect(result.data?.refreshToken).toBe('refresh-token');
    });
  });
});
