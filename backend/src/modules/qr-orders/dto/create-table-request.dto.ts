import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { RequestStatus, RequestType } from '../../../common/enums';

export class CreateTableRequestDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  sessionId: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  tableId: number;

  @ApiProperty({ enum: RequestType, example: RequestType.CALL_STAFF })
  @IsEnum(RequestType)
  @IsNotEmpty()
  requestType: RequestType;

  @ApiPropertyOptional({ enum: RequestStatus, default: RequestStatus.PENDING })
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;
}
