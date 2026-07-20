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
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { SupplierEntity } from './entities/supplier.entity';
import { PurchaseOrderEntity } from './entities/purchase-order.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Suppliers')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างซัพพลายเออร์ใหม่' })
  @ApiResponse({ status: 201, type: SupplierEntity })
  async createSupplier(
    @Body() dto: CreateSupplierDto,
  ): Promise<SupplierEntity> {
    return this.suppliersService.createSupplier(dto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการซัพพลายเออร์แบบแบ่งหน้า' })
  async findAllSuppliers(@Query() pagination: PaginationQueryDto): Promise<{
    data: SupplierEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.suppliersService.findAllSuppliers(pagination);
  }

  @Get('purchase-orders')
  @ApiOperation({ summary: 'ดึงรายการใบสั่งซื้อแบบแบ่งหน้า' })
  async findAllPurchaseOrders(
    @Query() pagination: PaginationQueryDto,
  ): Promise<{
    data: PurchaseOrderEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.suppliersService.findAllPurchaseOrders(pagination);
  }

  @Post('purchase-orders')
  @ApiOperation({ summary: 'สร้างใบสั่งซื้อสินค้าใหม่' })
  @ApiResponse({ status: 201, type: PurchaseOrderEntity })
  async createPurchaseOrder(
    @Body() dto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrderEntity> {
    return this.suppliersService.createPurchaseOrder(dto);
  }

  @Get('purchase-orders/:id')
  @ApiOperation({ summary: 'ดึงข้อมูลใบสั่งซื้อตาม ID' })
  async findOnePurchaseOrder(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PurchaseOrderEntity> {
    return this.suppliersService.findOnePurchaseOrder(id);
  }

  @Patch('purchase-orders/:id')
  @ApiOperation({ summary: 'อัปเดตสถานะใบสั่งซื้อ' })
  async updatePurchaseOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrderEntity> {
    return this.suppliersService.updatePurchaseOrder(id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลซัพพลายเออร์ตาม ID' })
  async findOneSupplier(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SupplierEntity> {
    return this.suppliersService.findOneSupplier(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลซัพพลายเออร์' })
  async updateSupplier(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupplierDto,
  ): Promise<SupplierEntity> {
    return this.suppliersService.updateSupplier(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'ลบซัพพลายเออร์ (Soft Delete)' })
  async removeSupplier(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.suppliersService.removeSupplier(id);
  }
}
