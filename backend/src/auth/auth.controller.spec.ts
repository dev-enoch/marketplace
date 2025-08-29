import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
    me: jest.fn(),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should return success when user is registered', async () => {
      const dto = {
        email: 'test@mail.com',
        password: 'pass123',
        firstName: 'John',
        lastName: 'Doe',
      };
      mockAuthService.register.mockResolvedValue({ success: true });

      const result = await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ success: true });
    });

    it('should return error when email already exists', async () => {
      const dto = {
        email: 'test@mail.com',
        password: 'pass123',
        firstName: 'John',
        lastName: 'Doe',
      };
      mockAuthService.register.mockResolvedValue({
        success: false,
        message: 'Email already in use',
      });

      const result = await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        success: false,
        message: 'Email already in use',
      });
    });
  });

  describe('login', () => {
    it('should return tokens on valid login', async () => {
      const dto = { email: 'test@mail.com', password: 'pass123' };
      mockAuthService.login.mockResolvedValue({
        success: true,
        data: { accessToken: 'token' },
      });

      const result = await controller.login(dto);

      expect(service.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ success: true, data: { accessToken: 'token' } });
    });

    it('should return error on invalid credentials', async () => {
      const dto = { email: 'wrong@mail.com', password: 'wrong' };
      mockAuthService.login.mockResolvedValue({
        success: false,
        message: 'Invalid credentials',
      });

      const result = await controller.login(dto);

      expect(service.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        success: false,
        message: 'Invalid credentials',
      });
    });
  });

  describe('refresh', () => {
    it('should refresh tokens if refresh token is valid', async () => {
      const req = { user: { sub: 'user-id', refreshToken: 'refresh' } } as any;
      mockAuthService.refreshTokens.mockResolvedValue({
        success: true,
        data: { accessToken: 'new-token' },
      });

      const result = await controller.refresh(req);

      expect(service.refreshTokens).toHaveBeenCalledWith('user-id', 'refresh');
      expect(result).toEqual({
        success: true,
        data: { accessToken: 'new-token' },
      });
    });

    it('should return error if refresh token is invalid', async () => {
      const req = {
        user: { sub: 'user-id', refreshToken: 'bad-refresh' },
      } as any;
      mockAuthService.refreshTokens.mockResolvedValue({
        success: false,
        message: 'Access denied',
      });

      const result = await controller.refresh(req);

      expect(service.refreshTokens).toHaveBeenCalledWith(
        'user-id',
        'bad-refresh',
      );
      expect(result).toEqual({ success: false, message: 'Access denied' });
    });
  });

  describe('me', () => {
    it('should return user profile', async () => {
      const req = { user: { sub: 'user-id' } } as any;
      mockAuthService.me.mockResolvedValue({
        success: true,
        data: { id: 'user-id', email: 'test@mail.com' },
      });

      const result = await controller.me(req);

      expect(service.me).toHaveBeenCalledWith('user-id');
      expect(result).toEqual({
        success: true,
        data: { id: 'user-id', email: 'test@mail.com' },
      });
    });

    it('should return error if user not found', async () => {
      const req = { user: { sub: 'missing-id' } } as any;
      mockAuthService.me.mockResolvedValue({
        success: false,
        message: 'User not found',
      });

      const result = await controller.me(req);

      expect(service.me).toHaveBeenCalledWith('missing-id');
      expect(result).toEqual({ success: false, message: 'User not found' });
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const req = { user: { sub: 'user-id' } } as any;
      const body = { firstName: 'New', lastName: 'Name' };
      mockAuthService.updateProfile.mockResolvedValue({
        success: true,
        data: body,
      });

      const result = await controller.updateProfile(req, body);

      expect(service.updateProfile).toHaveBeenCalledWith('user-id', body);
      expect(result).toEqual({ success: true, data: body });
    });

    it('should return error if update fails', async () => {
      const req = { user: { sub: 'user-id' } } as any;
      const body = { firstName: 'New' };
      mockAuthService.updateProfile.mockResolvedValue({
        success: false,
        message: 'Update failed',
      });

      const result = await controller.updateProfile(req, body);

      expect(service.updateProfile).toHaveBeenCalledWith('user-id', body);
      expect(result).toEqual({ success: false, message: 'Update failed' });
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const req = { user: { sub: 'user-id' } } as any;
      const body = { oldPassword: 'old', newPassword: 'new' };
      mockAuthService.changePassword.mockResolvedValue({
        success: true,
        message: 'Password updated successfully',
      });

      const result = await controller.changePassword(req, body);

      expect(service.changePassword).toHaveBeenCalledWith(
        'user-id',
        'old',
        'new',
      );
      expect(result).toEqual({
        success: true,
        message: 'Password updated successfully',
      });
    });

    it('should return error if old password is wrong', async () => {
      const req = { user: { sub: 'user-id' } } as any;
      const body = { oldPassword: 'wrong', newPassword: 'new' };
      mockAuthService.changePassword.mockResolvedValue({
        success: false,
        message: 'Invalid current password',
      });

      const result = await controller.changePassword(req, body);

      expect(service.changePassword).toHaveBeenCalledWith(
        'user-id',
        'wrong',
        'new',
      );
      expect(result).toEqual({
        success: false,
        message: 'Invalid current password',
      });
    });
  });
});
