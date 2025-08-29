import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: NotificationsService;

  const mockNotificationsService = {
    getUserNotifications: jest.fn(),
    markAsRead: jest.fn(),
  };

  const mockReq = { user: { id: 'user-123' } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getNotifications', () => {
    it('should return user notifications', async () => {
      const notifications = [{ id: 'n1' }, { id: 'n2' }];
      mockNotificationsService.getUserNotifications.mockResolvedValue(
        notifications,
      );

      const result = await controller.getNotifications(mockReq);

      expect(result).toEqual(notifications);
      expect(service.getUserNotifications).toHaveBeenCalledWith('user-123');
    });

    it('should throw if service fails', async () => {
      mockNotificationsService.getUserNotifications.mockRejectedValue(
        new Error('DB error'),
      );
      await expect(controller.getNotifications(mockReq)).rejects.toThrow(
        'DB error',
      );
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const updated = { id: 'n1', isRead: true };
      mockNotificationsService.markAsRead.mockResolvedValue(updated);

      const result = await controller.markAsRead('n1', mockReq);

      expect(result).toEqual(updated);
      expect(service.markAsRead).toHaveBeenCalledWith('user-123', 'n1');
    });

    it('should throw if service fails', async () => {
      mockNotificationsService.markAsRead.mockRejectedValue(
        new Error('Not found'),
      );
      await expect(controller.markAsRead('n1', mockReq)).rejects.toThrow(
        'Not found',
      );
    });
  });
});
