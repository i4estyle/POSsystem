import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentMethodStatus } from '../../../common/enums';

export class CreatePaymentMethodDto {
  @ApiProperty({ example: 'promptpay' })
  @IsString()
  @IsNotEmpty()
  methodName: string;

  @ApiPropertyOptional({
    enum: PaymentMethodStatus,
    default: PaymentMethodStatus.ACTIVE,
  })
  @IsEnum(PaymentMethodStatus)
  @IsOptional()
  status?: PaymentMethodStatus;
}
