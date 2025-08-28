import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCartItemDto {
  @ApiProperty({ description: 'New absolute quantity', example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}
