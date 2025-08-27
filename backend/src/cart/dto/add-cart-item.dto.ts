import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AddCartItemDto {
  @ApiProperty({ description: 'Product ID to add', example: 42 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  productId!: number;

  @ApiPropertyOptional({
    description: 'Quantity to add (default 1)',
    example: 2,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}
