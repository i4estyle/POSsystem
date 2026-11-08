import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  paymentMethodId: number;

  @ApiProperty({ example: 110.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: '2c7fecc6-a9c4-46f7-bd0e-c9c748253ee8' })
  @IsUUID()
  idempotencyKey: string;

  @ApiPropertyOptional({ example: 'TXN-20250115-9988' })
  @IsString()
  @IsOptional()
  referenceNo?: string;
}
