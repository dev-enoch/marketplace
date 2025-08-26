import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  IsInt,
  Min,
  Matches,
  ArrayUnique,
  IsUrl,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus, ProductType } from '../product-status.enum';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ description: 'Unique slug for the product' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase and can include hyphens',
  })
  slug: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Product price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Currency code, e.g., USD' })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{3}$/, { message: 'Currency must be 3 uppercase letters' })
  currency?: string;

  @ApiPropertyOptional({ description: 'Available quantity' })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Product status',
    enum: ProductStatus,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ description: 'Type of product', enum: ProductType })
  @IsOptional()
  @IsEnum(ProductType)
  productType?: ProductType;

  @ApiPropertyOptional({ description: 'Product category or tag' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Array of product tags', type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Array of product image URLs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Optional variants in JSON format',
  })
  @IsOptional()
  variants?: any;
}
