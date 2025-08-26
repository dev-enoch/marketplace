import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
      return { success: false, message: 'Could not update product' };
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.product.delete({ where: { id } });
      return { success: true, data: { id } };
    } catch (error) {
      return { success: false, message: 'Could not delete product' };
    }
  }
}
