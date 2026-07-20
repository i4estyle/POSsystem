import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTableRequestDto } from './create-table-request.dto';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { RequestStatus } from '../../../common/enums';

export class UpdateTableRequestDto extends PartialType(CreateTableRequestDto) {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  handledByEmployeeId?: number;

  @ApiPropertyOptional({ enum: RequestStatus })
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;
}
