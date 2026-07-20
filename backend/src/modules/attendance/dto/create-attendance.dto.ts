import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { AttendanceStatus } from '../../../common/enums';

export class CreateAttendanceDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  employeeId: number;

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  @IsNotEmpty()
  workDate: string;

  @ApiPropertyOptional({ example: '2025-01-15T08:30:00Z' })
  @IsDateString()
  @IsOptional()
  checkIn?: string;

  @ApiPropertyOptional({ example: '2025-01-15T17:30:00Z' })
  @IsDateString()
  @IsOptional()
  checkOut?: string;

  @ApiPropertyOptional({
    enum: AttendanceStatus,
    default: AttendanceStatus.ON_TIME,
  })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;
}
