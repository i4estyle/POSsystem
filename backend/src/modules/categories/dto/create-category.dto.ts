import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  parentCategoryId?: number;

  @ApiProperty({ example: 'เครื่องดื่ม' })
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @ApiPropertyOptional({ example: 'หมวดหมู่เครื่องดื่มร้อน เย็น ปั่น' })
  @IsString()
  @IsOptional()
  description?: string;
}
