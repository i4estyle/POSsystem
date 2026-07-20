import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PromotionStatus, PromotionType } from '../../../common/enums';

export class CreatePromotionDto {
  @ApiProperty({ example: 'ส่วนลดรับเปิดร้าน 10%' })
  @IsString()
  @IsNotEmpty()
  promotionName: string;

  @ApiProperty({ enum: PromotionType, example: PromotionType.PERCENT })
  @IsEnum(PromotionType)
  @IsNotEmpty()
  promotionType: PromotionType;

  @ApiProperty({ example: 10.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiPropertyOptional({ example: 100.0, default: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPurchaseAmount?: number;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiPropertyOptional({
    enum: PromotionStatus,
    default: PromotionStatus.ACTIVE,
  })
  @IsEnum(PromotionStatus)
  @IsOptional()
  status?: PromotionStatus;

  @ApiPropertyOptional({ type: [Number], example: [1, 2, 3] })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  eligibleProductIds?: number[];
}
