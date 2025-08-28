import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PurchaseEmailDto {
  @ApiProperty({ example: 'user@example.com' })
  to: string;

  @ApiProperty({ example: 'ORD12345' })
  orderId: string;

  @ApiProperty({ type: [String], example: ['Item 1', 'Item 2'] })
  items: string[];

  @ApiProperty({ example: 99.99 })
  total: number;
}

export class RenewalEmailDto {
  @ApiProperty({ example: 'user@example.com' })
  to: string;

  @ApiProperty({ example: 'Premium Plan' })
  planName: string;

  @ApiProperty({ example: '2025-09-01T00:00:00Z' })
  renewDate: Date;
}

export class CartAbandonmentEmailDto {
  @ApiProperty({ example: 'user@example.com' })
  to: string;

  @ApiProperty({ type: [String], example: ['Item 1', 'Item 2'] })
  items: string[];

  @ApiPropertyOptional({ example: 'DISCOUNT10' })
  discountCode?: string;
}
