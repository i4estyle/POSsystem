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
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { StockEntity } from './entities/stock.entity';
import { StockMovementEntity } from './entities/stock-movement.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Stocks')
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างรายการสต็อกใหม่' })
  @ApiResponse({ status: 201, type: StockEntity })
  async createStock(@Body() dto: CreateStockDto): Promise<StockEntity> {
    return this.stocksService.createStock(dto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการสต็อกแบบแบ่งหน้า' })
  async findAllStocks(@Query() pagination: PaginationQueryDto): Promise<{
    data: StockEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.stocksService.findAllStocks(pagination);
  }

  @Get('movements')
  @ApiOperation({ summary: 'ดึงรายการเคลื่อนไหวสต็อกแบบแบ่งหน้า' })
  async findAllMovements(@Query() pagination: PaginationQueryDto): Promise<{
    data: StockMovementEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.stocksService.findAllMovements(pagination);
  }

  @Post('movements')
  @ApiOperation({ summary: 'บันทึกการเคลื่อนไหวสต็อก (รับเข้า/จ่ายออก/ปรับ)' })
  @ApiResponse({ status: 201, type: StockMovementEntity })
  async recordMovement(
    @Body() dto: CreateStockMovementDto,
  ): Promise<StockMovementEntity> {
    return this.stocksService.recordMovement(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลสต็อกตาม ID' })
  async findOneStock(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StockEntity> {
    return this.stocksService.findOneStock(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลสต็อก' })
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStockDto,
  ): Promise<StockEntity> {
    return this.stocksService.updateStock(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'ลบรายการสต็อก (Soft Delete)' })
  async removeStock(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.stocksService.removeStock(id);
  }
}
