import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ example: 'บริษัท เมล็ดกาแฟไทย จำกัด' })
  @IsString()
  @IsNotEmpty()
  supplierName: string;

  @ApiPropertyOptional({ example: 'คุณวิชัย' })
  @IsString()
  @IsOptional()
  contactName?: string;

  @ApiProperty({ example: '029998888' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'contact@thaicoffee.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '123/45 ถนนเชียงใหม่-ฝาง เชียงใหม่' })
  @IsString()
  @IsOptional()
  address?: string;
}
