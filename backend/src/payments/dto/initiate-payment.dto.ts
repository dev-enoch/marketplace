import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class CustomerDto {
  @ApiProperty({ description: 'Customer email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Customer full name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class InitiatePaymentDto {
  @ApiProperty({ description: 'Amount to charge' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Currency code, e.g., NGN, USD' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Unique transaction reference' })
  @IsString()
  @IsNotEmpty()
  txRef: string;

  @ApiProperty({ description: 'Redirect URL after payment' })
  @IsString()
  @IsUrl()
  redirectUrl: string;

  @ApiProperty({ description: 'Customer information', type: CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;
}
