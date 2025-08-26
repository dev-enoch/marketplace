import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { SearchProductsDto } from './dto/search-products.dto';
import { ProductStatus, ProductType } from './product-status.enum';

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
              count: jest.fn(),
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
      status: 'ACTIVE' as ProductStatus,
      productType: 'PHYSICAL' as ProductType,
      category: 'Test',
      tags: ['test'],
      images: ['img1.jpg'],
    };

    const userId = 1;

    const result = await service.create(dto, userId);

    expect(result.success).toBe(true);
    expect(result.data?.name).toBe('Test Product');
    expect(prisma.product.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ createdById: userId }),
      }),
    );
  });

  it('should fetch all products', async () => {
    const result = await service.findAll();
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
  });

  it('should return paginated products', async () => {
    const dto: SearchProductsDto = { page: 2, limit: 5, search: 'Test' };

    const mockProducts = Array.from({ length: 5 }).map((_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
    }));
    const mockTotal = 23;

    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
    (prisma.product.count as jest.Mock).mockResolvedValue(mockTotal);

    const result = await service.search(dto);

    expect(result.success).toBe(true);
    expect(result.data.products).toHaveLength(5);
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 5, take: 5 }),
    );
    expect(prisma.product.count).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.any(Object) }),
    );

    expect(result.data.total).toBe(mockTotal);
    expect(result.data.page).toBe(dto.page);
    expect(result.data.limit).toBe(dto.limit);
    expect(result.data.totalPages).toBe(Math.ceil(mockTotal / dto.limit));
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
