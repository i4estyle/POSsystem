import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'สมชาย' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'ใจดี' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: 'นาย' })
  @IsString()
  @IsOptional()
  titlePrefix?: string;

  @ApiPropertyOptional({ example: 'data:image/jpeg;base64,...' })
  @IsString()
  @IsOptional()
  profileImage?: string;

  @ApiProperty({ example: '0812345678' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'somchai@cafely.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'somchai' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: '1100400123456' })
  @IsString()
  @Matches(/^[0-9]{13}$/, { message: 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก' })
  @IsOptional()
  nationalId?: string;

  @ApiPropertyOptional({ example: '123/45 ถนนสุขุมวิท กรุงเทพฯ' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  branchId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  roleId?: number;
}
