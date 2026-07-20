import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

  @ApiPropertyOptional({ enum: BranchStatus, default: BranchStatus.ACTIVE })
  @IsEnum(BranchStatus)
  @IsOptional()
  status?: BranchStatus;
}
