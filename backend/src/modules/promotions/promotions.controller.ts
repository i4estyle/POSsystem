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
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionEntity } from './entities/promotion.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างโปรโมชั่นใหม่' })
  @ApiResponse({ status: 201, type: PromotionEntity })
  async create(@Body() dto: CreatePromotionDto): Promise<PromotionEntity> {
    return this.promotionsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการโปรโมชั่นแบบแบ่งหน้า' })
  async findAll(@Query() pagination: PaginationQueryDto): Promise<{
    data: PromotionEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.promotionsService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลโปรโมชั่นตาม ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PromotionEntity> {
    return this.promotionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลโปรโมชั่น' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePromotionDto,
  ): Promise<PromotionEntity> {
    return this.promotionsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'ลบโปรโมชั่น (Soft Delete)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.promotionsService.remove(id);
  }
}
