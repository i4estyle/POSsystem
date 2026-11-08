import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BranchStatus } from '../../../common/enums';

export class CreateBranchDto {
  @ApiProperty({ example: 'สาขาหลัก สยาม' })
  @IsString()
  @IsNotEmpty()
  branchName: string;

  @ApiProperty({ example: '999/99 ถนนพระราม 1 ปทุมวัน กรุงเทพฯ' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '021234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 0.07, default: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  taxRate?: number;

  @ApiPropertyOptional({ enum: BranchStatus, default: BranchStatus.ACTIVE })
  @IsEnum(BranchStatus)
  @IsOptional()
  status?: BranchStatus;
}
