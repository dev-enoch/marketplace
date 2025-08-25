import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthenticatedUser } from 'src/auth/types/auth-request.type';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: { getProfile: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  it('should return user profile', async () => {
    const mockUser: AuthenticatedUser = {
      sub: 1,
      email: 'test@test.com',
      role: 'BUYER',
    };
    const mockResponse = { success: true, data: { email: 'test@test.com' } };

    (service.getProfile as jest.Mock).mockResolvedValue(mockResponse);

    const result = await controller.getProfile({ user: mockUser });
    expect(result).toEqual(mockResponse);
    expect(service.getProfile).toHaveBeenCalledWith(mockUser);
  });
});
