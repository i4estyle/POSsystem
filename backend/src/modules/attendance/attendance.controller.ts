import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceEntity } from './entities/attendance.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'บันทึกเวลาเข้างาน' })
  @ApiResponse({ status: 201, type: AttendanceEntity })
  async create(@Body() dto: CreateAttendanceDto): Promise<AttendanceEntity> {
    return this.attendanceService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการบันทึกเวลาเข้างานแบบแบ่งหน้า' })
  async findAll(@Query() pagination: PaginationQueryDto): Promise<{
    data: AttendanceEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.attendanceService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลบันทึกเวลาเข้างานตาม ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AttendanceEntity> {
    return this.attendanceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลบันทึกเวลาเข้างาน' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAttendanceDto,
  ): Promise<AttendanceEntity> {
    return this.attendanceService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'ลบบันทึกเวลาเข้างาน (Soft Delete)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.attendanceService.remove(id);
  }
}
