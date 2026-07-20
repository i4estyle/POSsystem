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
import { DiningTableStatus } from '../../../common/enums';

export class CreateDiningTableDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  branchId: number;

  @ApiProperty({ example: 'T-01' })
  @IsString()
  @IsNotEmpty()
  tableNumber: string;

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  seatCapacity: number;

  @ApiPropertyOptional({
    enum: DiningTableStatus,
    default: DiningTableStatus.AVAILABLE,
  })
  @IsEnum(DiningTableStatus)
  @IsOptional()
  status?: DiningTableStatus;
}
