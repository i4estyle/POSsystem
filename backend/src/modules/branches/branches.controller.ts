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
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchEntity } from './entities/branch.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Branches')
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างสาขาใหม่' })
  @ApiResponse({ status: 201, type: BranchEntity })
  async create(@Body() dto: CreateBranchDto): Promise<BranchEntity> {
    return this.branchesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการสาขาแบบแบ่งหน้า' })
  async findAll(@Query() pagination: PaginationQueryDto): Promise<{
    data: BranchEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.branchesService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลสาขาตาม ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<BranchEntity> {
    return this.branchesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลสาขา' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBranchDto,
  ): Promise<BranchEntity> {
    return this.branchesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'ลบสาขา (Soft Delete)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.branchesService.remove(id);
  }
}
