import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { NotFoundException } from '@nestjs/common';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  const mockCartService = {
    getCart: jest.fn(),
    addItem: jest.fn(),
    updateItem: jest.fn(),
    removeItem: jest.fn(),
  };

  const mockUser = { id: 'user-123' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return the cart', async () => {
      const mockResponse = { success: true, data: { cartId: 'c1', items: [] } };
      mockCartService.getCart.mockResolvedValue(mockResponse);

      const result = await controller.getCart({ user: mockUser });
      expect(result).toEqual(mockResponse);
      expect(service.getCart).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw if service fails', async () => {
      mockCartService.getCart.mockRejectedValue(new Error('DB error'));

      await expect(controller.getCart({ user: mockUser })).rejects.toThrow(
        'DB error',
      );
    });
  });

  describe('addItem', () => {
    it('should add an item to the cart', async () => {
      const mockResponse = { success: true, message: 'Item added' };
      mockCartService.addItem.mockResolvedValue(mockResponse);

      const body = { productId: 'p1', quantity: 2 };
      const result = await controller.addItem({ user: mockUser }, body);

      expect(result).toEqual(mockResponse);
      expect(service.addItem).toHaveBeenCalledWith(
        mockUser.id,
        body.productId,
        body.quantity,
      );
    });

    it('should throw NotFoundException if product not found', async () => {
      mockCartService.addItem.mockRejectedValue(new NotFoundException());

      await expect(
        controller.addItem(
          { user: mockUser },
          { productId: 'bad-id', quantity: 1 },
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateItem', () => {
    it('should update item quantity', async () => {
      const mockResponse = { success: true, message: 'Item updated' };
      mockCartService.updateItem.mockResolvedValue(mockResponse);

      const body = { quantity: 5 };
      const result = await controller.updateItem(
        { user: mockUser },
        'p1',
        body,
      );

      expect(result).toEqual(mockResponse);
      expect(service.updateItem).toHaveBeenCalledWith(
        mockUser.id,
        'p1',
        body.quantity,
      );
    });

    it('should throw NotFoundException if item not in cart', async () => {
      mockCartService.updateItem.mockRejectedValue(new NotFoundException());

      await expect(
        controller.updateItem({ user: mockUser }, 'bad-id', { quantity: 3 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the cart', async () => {
      const mockResponse = { success: true, message: 'Item removed' };
      mockCartService.removeItem.mockResolvedValue(mockResponse);

      const result = await controller.removeItem({ user: mockUser }, 'p1');

      expect(result).toEqual(mockResponse);
      expect(service.removeItem).toHaveBeenCalledWith(mockUser.id, 'p1');
    });

    it('should throw NotFoundException if item not in cart', async () => {
      mockCartService.removeItem.mockRejectedValue(new NotFoundException());

      await expect(
        controller.removeItem({ user: mockUser }, 'bad-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
