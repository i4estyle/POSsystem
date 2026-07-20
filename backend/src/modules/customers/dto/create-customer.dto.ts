import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { MemberLevel } from '../../../common/enums';

export class CreateCustomerDto {
  @ApiProperty({ example: 'กานต์' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'มีสุข' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '0898765432' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'karn@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 100, default: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  loyaltyPoint?: number;

  @ApiPropertyOptional({ enum: MemberLevel, default: MemberLevel.REGULAR })
  @IsEnum(MemberLevel)
  @IsOptional()
  memberLevel?: MemberLevel;

  @ApiPropertyOptional({ example: '2025-01-01T10:00:00Z' })
  @IsDateString()
  @IsOptional()
  registerDate?: string;
}
