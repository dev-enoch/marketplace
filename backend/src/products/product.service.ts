import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductsDto } from './dto/search-products.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, userId: number) {
    try {
      const product = await this.prisma.product.create({
        data: { ...dto, createdById: userId },
      });
      return { success: true, data: product };
    } catch (error) {
      return { success: false, message: 'Could not create product' };
    }
  }

  async findAll() {
    try {
      const products = await this.prisma.product.findMany();
      return { success: true, data: products };
    } catch (error) {
      return { success: false, message: 'Could not fetch products' };
    }
  }

  async search(dto: SearchProductsDto) {
    const {
      search,
      category,
      status,
      tags,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = dto;

    const filters: any = {};

    if (search) {
      filters.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) filters.category = category;
    if (status) filters.status = status;
    if (tags && tags.length > 0) filters.tags = { hasSome: tags };
    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.price = {};
      if (minPrice !== undefined) filters.price.gte = minPrice;
      if (maxPrice !== undefined) filters.price.lte = maxPrice;
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: filters,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where: filters }),
    ]);

    return {
      success: true,
      data: {
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) return { success: false, message: 'Product not found' };
      return { success: true, data: product };
    } catch (error) {
      return { success: false, message: 'Could not fetch product' };
    }
  }

  async update(id: number, dto: UpdateProductDto) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: dto,
      });
      return { success: true, data: product };
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.code === 'P2025') {
        return { success: false, message: 'Product not found' };
      }
      return { success: false, message: 'Could not update product' };
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.product.delete({ where: { id } });
      return { success: true, data: { id } };
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error.code === 'P2025') {
        return { success: false, message: 'Product not found' };
      }
      return { success: false, message: 'Could not delete product' };
    }
  }
}
