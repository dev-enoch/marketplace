import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({ description: 'Name of the product' })
  name?: string;

  @ApiPropertyOptional({ description: 'Slug of the product (unique)' })
  slug?: string;

  @ApiPropertyOptional({ description: 'Description of the product' })
  description?: string;

  @ApiPropertyOptional({ description: 'Price of the product' })
  price?: number;

  @ApiPropertyOptional({
    description: 'Currency of the product price',
    default: 'USD',
  })
  currency?: string;

  @ApiPropertyOptional({ description: 'Quantity available' })
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Status of the product: ACTIVE, INACTIVE, DRAFT',
  })
  status?: string;

  @ApiPropertyOptional({
    description: 'Type of the product: DIGITAL or PHYSICAL',
  })
  productType?: string;

  @ApiPropertyOptional({ description: 'Category or tag of the product' })
  category?: string;

  @ApiPropertyOptional({ description: 'Array of tags', type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Array of image URLs', type: [String] })
  images?: string[];

  @ApiPropertyOptional({ description: 'Variants or options in JSON format' })
  variants?: any;
}
