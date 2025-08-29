import { Test, TestingModule } from '@nestjs/testing';
import { AffiliateController } from './affiliate.controller';
import { AffiliateService } from './affiliate.service';

describe('AffiliateController', () => {
  let controller: AffiliateController;
  let service: AffiliateService;

  const mockAffiliateService = {
    getDashboard: jest.fn(),
    requestWithdrawal: jest.fn(),
    getReferrals: jest.fn(),
  };

  const mockReq = { user: { id: 'user-123' } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffiliateController],
      providers: [
        {
          provide: AffiliateService,
          useValue: mockAffiliateService,
        },
      ],
    }).compile();

    controller = module.get<AffiliateController>(AffiliateController);
    service = module.get<AffiliateService>(AffiliateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboard', () => {
    it('should return dashboard data', async () => {
      const dashboard = { balance: 100, totalCommission: 200 };
      mockAffiliateService.getDashboard.mockResolvedValue(dashboard);

      const result = await controller.getDashboard(mockReq);

      expect(result).toEqual(dashboard);
      expect(service.getDashboard).toHaveBeenCalledWith('user-123');
    });

    it('should throw if service fails', async () => {
      mockAffiliateService.getDashboard.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(controller.getDashboard(mockReq)).rejects.toThrow(
        'Service error',
      );
    });
  });

  describe('withdraw', () => {
    it('should request withdrawal successfully', async () => {
      const withdrawal = { success: true, amount: 50 };
      mockAffiliateService.requestWithdrawal.mockResolvedValue(withdrawal);

      const result = await controller.withdraw(mockReq, { amount: 50 });

      expect(result).toEqual(withdrawal);
      expect(service.requestWithdrawal).toHaveBeenCalledWith('user-123', {
        amount: 50,
      });
    });

    it('should throw if service fails', async () => {
      mockAffiliateService.requestWithdrawal.mockRejectedValue(
        new Error('Insufficient balance'),
      );

      await expect(
        controller.withdraw(mockReq, { amount: 100 }),
      ).rejects.toThrow('Insufficient balance');
    });
  });

  describe('referrals', () => {
    it('should return referrals list', async () => {
      const referrals = [{ id: 'ref-1' }, { id: 'ref-2' }];
      mockAffiliateService.getReferrals.mockResolvedValue(referrals);

      const result = await controller.referrals(mockReq);

      expect(result).toEqual(referrals);
      expect(service.getReferrals).toHaveBeenCalledWith('user-123');
    });

    it('should throw if service fails', async () => {
      mockAffiliateService.getReferrals.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.referrals(mockReq)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
