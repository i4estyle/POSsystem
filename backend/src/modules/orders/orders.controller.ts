import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderEntity } from './entities/order.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import type { AuthPrincipal } from '../../common/interfaces/auth-principal.interface';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างคำสั่งซื้อใหม่ (POS / QR Order)' })
  @ApiResponse({ status: 201, type: OrderEntity })
  async create(
    @Body() dto: CreateOrderDto,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<OrderEntity> {
    return this.ordersService.create(dto, principal);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการคำสั่งซื้อแบบแบ่งหน้า' })
  async findAll(
    @Query() pagination: PaginationQueryDto,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<{
    data: OrderEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.ordersService.findAll(pagination, principal);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลคำสั่งซื้อตาม ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<OrderEntity> {
    return this.ordersService.findOne(id, principal);
  }

  @Get('external/:externalId')
  @ApiOperation({ summary: 'ดึงข้อมูลคำสั่งซื้อด้วย external UUID' })
  async findOneByExternalId(
    @Param('externalId', ParseUUIDPipe) externalId: string,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<OrderEntity> {
    return this.ordersService.findOneByExternalId(externalId, principal);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'อัปเดตสถานะคำสั่งซื้อ (พร้อมบันทึกประวัติ)' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<OrderEntity> {
    return this.ordersService.updateStatus(id, dto, principal);
  }
}
