import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @ApiPropertyOptional({ example: 'ผู้ดูแลระบบสูงสุด' })
  @IsString()
  @IsOptional()
  description?: string;
}
