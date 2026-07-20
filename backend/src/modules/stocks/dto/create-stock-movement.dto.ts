import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { MovementType, ReferenceType } from '../../../common/enums';

export class CreateStockMovementDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  branchId: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  employeeId: number;

  @ApiProperty({ enum: MovementType, example: MovementType.IN })
  @IsEnum(MovementType)
  @IsNotEmpty()
  movementType: MovementType;

  @ApiProperty({ example: 50 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    enum: ReferenceType,
    default: ReferenceType.MANUAL,
  })
  @IsEnum(ReferenceType)
  @IsOptional()
  referenceType?: ReferenceType;

  @ApiPropertyOptional({ example: 101 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  referenceId?: number;

  @ApiPropertyOptional({ example: 'ปรับปรุงสินค้าสต็อกรับเข้า' })
  @IsString()
  @IsOptional()
  note?: string;
}
