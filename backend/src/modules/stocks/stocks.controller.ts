import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { StockEntity } from './entities/stock.entity';
import { StockMovementEntity } from './entities/stock-movement.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleName } from '../../common/enums';
import type { AuthPrincipal } from '../../common/interfaces/auth-principal.interface';

@ApiTags('Stocks')
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Post()
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @ApiOperation({ summary: 'สร้างรายการสต็อกใหม่' })
  @ApiResponse({ status: 201, type: StockEntity })
  async createStock(
    @Body() dto: CreateStockDto,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<StockEntity> {
    return this.stocksService.createStock(dto, principal);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการสต็อกแบบแบ่งหน้า' })
  async findAllStocks(
    @Query() pagination: PaginationQueryDto,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<{
    data: StockEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.stocksService.findAllStocks(pagination, principal);
  }

  @Get('movements')
  @ApiOperation({ summary: 'ดึงรายการเคลื่อนไหวสต็อกแบบแบ่งหน้า' })
  async findAllMovements(
    @Query() pagination: PaginationQueryDto,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<{
    data: StockMovementEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.stocksService.findAllMovements(pagination, principal);
  }

  @Post('movements')
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @ApiOperation({ summary: 'บันทึกการเคลื่อนไหวสต็อก (รับเข้า/จ่ายออก/ปรับ)' })
  @ApiResponse({ status: 201, type: StockMovementEntity })
  async recordMovement(
    @Body() dto: CreateStockMovementDto,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<StockMovementEntity> {
    return this.stocksService.recordMovement(dto, principal);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลสต็อกตาม ID' })
  async findOneStock(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<StockEntity> {
    return this.stocksService.findOneStock(id, principal);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @ApiOperation({ summary: 'แก้ไขข้อมูลสต็อก' })
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStockDto,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<StockEntity> {
    return this.stocksService.updateStock(id, dto, principal);
  }
}
