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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderEntity } from './entities/order.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างคำสั่งซื้อใหม่ (POS / QR Order)' })
  @ApiResponse({ status: 201, type: OrderEntity })
  async create(@Body() dto: CreateOrderDto): Promise<OrderEntity> {
    return this.ordersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการคำสั่งซื้อแบบแบ่งหน้า' })
  async findAll(@Query() pagination: PaginationQueryDto): Promise<{
    data: OrderEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.ordersService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลคำสั่งซื้อตาม ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderEntity> {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลคำสั่งซื้อ' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    return this.ordersService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'อัปเดตสถานะคำสั่งซื้อ (พร้อมบันทึกประวัติ)' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<OrderEntity> {
    return this.ordersService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'ลบคำสั่งซื้อ (Soft Delete)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersService.remove(id);
  }
}
