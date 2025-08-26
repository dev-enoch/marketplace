import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from 'src/common/decorators/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    slug: 'test-product',
    price: 10,
    createdById: 1,
  };

  const mockService = {
    create: jest.fn().mockResolvedValue({ success: true, data: mockProduct }),
    findAll: jest
      .fn()
      .mockResolvedValue({ success: true, data: [mockProduct] }),
    findOne: jest.fn().mockResolvedValue({ success: true, data: mockProduct }),
    update: jest.fn().mockResolvedValue({ success: true, data: mockProduct }),
    remove: jest.fn().mockResolvedValue({ success: true, data: mockProduct }),
  };

  const mockJwtGuard = {
    canActivate: jest.fn((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();
      req.user = { sub: 1, role: 'SELLER' };
      return true;
    }),
  };

  const mockRolesGuard = { canActivate: jest.fn().mockReturnValue(true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', async () => {
    const mockReq = { user: { sub: 1, role: 'SELLER' } };
    const result = await controller.create(
      { name: 'Test Product', slug: 'test-product', price: 10 },
      mockReq,
    );

    expect(result.success).toBe(true);
    expect(result.data?.name).toBe('Test Product');
  });

  it('should return all products', async () => {
    const result = await controller.findAll();
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
  });

  it('should return one product', async () => {
    const result = await controller.findOne('1');
    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(1);
  });

  it('should update a product', async () => {
    const result = await controller.update('1', { price: 20 });
    expect(result.success).toBe(true);
  });

  it('should delete a product', async () => {
    const result = await controller.remove('1');
    expect(result.success).toBe(true);
  });
});
