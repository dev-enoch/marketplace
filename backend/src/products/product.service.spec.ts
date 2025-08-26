import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  const mockProduct: Product = {
    id: 1,
    uuid: 'uuid-1',
    name: 'Test Product',
    slug: 'test-product',
    description: 'Test',
    price: 10,
    currency: 'USD',
    quantity: 5,
    status: 'ACTIVE',
    productType: 'PHYSICAL',
    category: 'Category1',
    tags: [],
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: 1,
    variants: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              create: jest.fn().mockResolvedValue(mockProduct),
              findMany: jest.fn().mockResolvedValue([mockProduct]),
              findUnique: jest.fn().mockResolvedValue(mockProduct),
              update: jest.fn().mockResolvedValue(mockProduct),
              delete: jest.fn().mockResolvedValue(mockProduct),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const dto = {
      name: 'Test Product',
      slug: 'test-product',
      price: 10,
      description: 'A test product',
      quantity: 5,
      currency: 'USD',
      status: 'ACTIVE',
      productType: 'PHYSICAL',
      category: 'Test',
      tags: ['test'],
      images: ['img1.jpg'],
    };

    const userId = 1;

    const result = await service.create(dto, userId);

    expect(result.success).toBe(true);
    expect(result.data?.name).toBe('Test Product');
  });

  it('should fetch all products', async () => {
    const result = await service.findAll();
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
  });

  it('should fetch one product', async () => {
    const result = await service.findOne(1);
    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(1);
  });

  it('should update a product', async () => {
    const result = await service.update(1, { price: 20 });
    expect(result.success).toBe(true);
    expect(result.data?.price).toBe(10);
  });

  it('should delete a product', async () => {
    const result = await service.remove(1);
    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(1);
  });
});
