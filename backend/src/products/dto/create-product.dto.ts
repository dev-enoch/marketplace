import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Unique slug for the product' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Product price' })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ description: 'Currency code, e.g., USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Available quantity' })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Product status: ACTIVE, INACTIVE, DRAFT',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Type of product: DIGITAL, PHYSICAL' })
  @IsOptional()
  @IsString()
  productType?: string;

  @ApiPropertyOptional({ description: 'Product category or tag' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Array of product tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Array of product image URLs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Optional variants in JSON format',
  })
  @IsOptional()
  variants?: any;
}
