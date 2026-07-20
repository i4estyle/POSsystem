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
import { DiningTablesService } from './dining-tables.service';
import { CreateDiningTableDto } from './dto/create-dining-table.dto';
import { UpdateDiningTableDto } from './dto/update-dining-table.dto';
import { DiningTableEntity } from './entities/dining-table.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Dining Tables')
@Controller('dining-tables')
export class DiningTablesController {
  constructor(private readonly diningTablesService: DiningTablesService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างโต๊ะอาหารใหม่' })
  @ApiResponse({ status: 201, type: DiningTableEntity })
  async create(@Body() dto: CreateDiningTableDto): Promise<DiningTableEntity> {
    return this.diningTablesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการโต๊ะอาหารแบบแบ่งหน้า' })
  async findAll(@Query() pagination: PaginationQueryDto): Promise<{
    data: DiningTableEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.diningTablesService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลโต๊ะอาหารตาม ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DiningTableEntity> {
    return this.diningTablesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลโต๊ะอาหาร' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDiningTableDto,
  ): Promise<DiningTableEntity> {
    return this.diningTablesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'ลบโต๊ะอาหาร (Soft Delete)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.diningTablesService.remove(id);
  }
}
