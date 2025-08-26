import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '../product-status.enum';

export class SearchProductsDto {
  @ApiPropertyOptional({
    description: 'Search keyword for product name or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by product category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    enum: ProductStatus,
    description: 'Filter by product status: ACTIVE, INACTIVE, DRAFT',
  })
  @IsOptional()
  @IsString()
  @IsEnum(ProductStatus)
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter by product tags',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
      : value,
  )
  tags?: string[];

  @ApiPropertyOptional({ description: 'Minimum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
