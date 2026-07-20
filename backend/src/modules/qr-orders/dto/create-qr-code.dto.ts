import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { QrCodeStatus, QrType } from '../../../common/enums';

export class CreateQrCodeDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  branchId: number;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  tableId?: number;

  @ApiPropertyOptional({ enum: QrType, default: QrType.DINE_IN })
  @IsEnum(QrType)
  @IsOptional()
  qrType?: QrType;

  @ApiPropertyOptional({ example: 'QR-TOKEN-ABCD-1234' })
  @IsString()
  @IsOptional()
  codeToken?: string;

  @ApiPropertyOptional({ enum: QrCodeStatus, default: QrCodeStatus.ACTIVE })
  @IsEnum(QrCodeStatus)
  @IsOptional()
  status?: QrCodeStatus;
}
