import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { NotFoundException, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

describe('CheckoutController', () => {
  let controller: CheckoutController;
  let service: CheckoutService;

  const mockCheckoutService = {
    createCheckout: jest.fn(),
    confirmCheckout: jest.fn(),
    handleWebhook: jest.fn(),
    listOrders: jest.fn(),
    getOrder: jest.fn(),
  };

  const mockReq = { user: { id: 'user123' } };

  // Mock guard to always pass
  class MockJwtAuthGuard {
    canActivate(context: ExecutionContext) {
      return true;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckoutController],
      providers: [
        {
          provide: CheckoutService,
          useValue: mockCheckoutService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    controller = module.get<CheckoutController>(CheckoutController);
    service = module.get<CheckoutService>(CheckoutService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCheckout', () => {
    it('should return checkout init response', async () => {
      const mockRes = { success: true, paymentLink: 'http://flw.com/pay' };
      mockCheckoutService.createCheckout.mockResolvedValue(mockRes);

      const result = await controller.createCheckout(mockReq);
      expect(result).toEqual(mockRes);
      expect(service.createCheckout).toHaveBeenCalledWith('user123');
    });

    it('should throw if cart is empty', async () => {
      mockCheckoutService.createCheckout.mockRejectedValue(
        new NotFoundException('Cart is empty'),
      );
      await expect(controller.createCheckout(mockReq)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('confirmCheckout', () => {
    it('should confirm checkout', async () => {
      const mockRes = { success: true, status: 'PENDING' };
      mockCheckoutService.confirmCheckout.mockResolvedValue(mockRes);

      const result = await controller.confirmCheckout(mockReq, {
        orderId: 'o1',
      });
      expect(result).toEqual(mockRes);
      expect(service.confirmCheckout).toHaveBeenCalledWith('user123', 'o1');
    });

    it('should throw if order not found', async () => {
      mockCheckoutService.confirmCheckout.mockRejectedValue(
        new NotFoundException('Order not found'),
      );
      await expect(
        controller.confirmCheckout(mockReq, { orderId: 'bad' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('handleWebhook', () => {
    it('should process webhook', async () => {
      const payload = { data: { tx_ref: 'tx1' } };
      const mockRes = { success: true };
      mockCheckoutService.handleWebhook.mockResolvedValue(mockRes);

      const result = await controller.handleWebhook(payload);
      expect(result).toEqual(mockRes);
      expect(service.handleWebhook).toHaveBeenCalledWith(payload);
    });

    it('should throw if payment not found', async () => {
      mockCheckoutService.handleWebhook.mockRejectedValue(
        new NotFoundException('Payment not found'),
      );
      await expect(controller.handleWebhook({})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('listOrders', () => {
    it('should return list of orders', async () => {
      const mockOrders = [{ id: 'o1', total: 200 }];
      mockCheckoutService.listOrders.mockResolvedValue(mockOrders);

      const result = await controller.listOrders(mockReq);
      expect(result).toEqual(mockOrders);
      expect(service.listOrders).toHaveBeenCalledWith('user123');
    });
  });

  describe('getOrder', () => {
    it('should return order details', async () => {
      const mockOrder = { id: 'o1', total: 200 };
      mockCheckoutService.getOrder.mockResolvedValue(mockOrder);

      const result = await controller.getOrder(mockReq, 'o1');
      expect(result).toEqual(mockOrder);
      expect(service.getOrder).toHaveBeenCalledWith('user123', 'o1');
    });

    it('should throw if order not found', async () => {
      mockCheckoutService.getOrder.mockRejectedValue(
        new NotFoundException('Order not found'),
      );
      await expect(controller.getOrder(mockReq, 'bad')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
