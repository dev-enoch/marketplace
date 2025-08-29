import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  const mockAnalyticsService = {
    trackAction: jest.fn(),
    getAnalytics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('trackAction', () => {
    it('should call analyticsService.trackAction with correct params', async () => {
      const dto = {
        action: 'view',
        productId: 'prod-123',
        metadata: { key: 'value' },
      };
      const req = { user: { id: 'user-1' } };
      const expected = { success: true };

      mockAnalyticsService.trackAction.mockResolvedValue(expected);

      const result = await controller.trackAction(req, dto);

      expect(service.trackAction).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual(expected);
    });

    it('should throw if analyticsService.trackAction fails', async () => {
      const dto = { action: 'view' };
      const req = { user: { id: 'user-1' } };

      mockAnalyticsService.trackAction.mockRejectedValue(
        new Error('Failed to track'),
      );

      await expect(controller.trackAction(req, dto)).rejects.toThrow(
        'Failed to track',
      );
    });
  });

  describe('getAnalytics', () => {
    it('should call analyticsService.getAnalytics with user object', async () => {
      const req = { user: { id: 'admin-1', role: 'ADMIN' } };
      const expected = [{ id: 'a1', action: 'view', userId: 'u1' }];

      mockAnalyticsService.getAnalytics.mockResolvedValue(expected);

      const result = await controller.getAnalytics(req);

      expect(service.getAnalytics).toHaveBeenCalledWith(req.user);
      expect(result).toEqual(expected);
    });

    it('should throw if analyticsService.getAnalytics fails', async () => {
      const req = { user: { id: 'admin-1', role: 'ADMIN' } };

      mockAnalyticsService.getAnalytics.mockRejectedValue(
        new Error('Not authorized'),
      );

      await expect(controller.getAnalytics(req)).rejects.toThrow(
        'Not authorized',
      );
    });
  });
});
