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
import { SalariesService } from './salaries.service';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { SalaryEntity } from './entities/salary.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Salaries')
@Controller('salaries')
export class SalariesController {
  constructor(private readonly salariesService: SalariesService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างรายการเงินเดือน' })
  @ApiResponse({ status: 201, type: SalaryEntity })
  async create(@Body() dto: CreateSalaryDto): Promise<SalaryEntity> {
    return this.salariesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการเงินเดือนแบบแบ่งหน้า' })
  async findAll(@Query() pagination: PaginationQueryDto): Promise<{
    data: SalaryEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.salariesService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลเงินเดือนตาม ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SalaryEntity> {
    return this.salariesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลเงินเดือน' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSalaryDto,
  ): Promise<SalaryEntity> {
    return this.salariesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'ลบรายการเงินเดือน (Soft Delete)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.salariesService.remove(id);
  }
}
