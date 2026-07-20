import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { PurchaseOrderEntity } from './entities/purchase-order.entity';
import { PurchaseOrderItemEntity } from './entities/purchase-order-item.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly supplierRepository: Repository<SupplierEntity>,
    @InjectRepository(PurchaseOrderEntity)
    private readonly poRepository: Repository<PurchaseOrderEntity>,
    @InjectRepository(PurchaseOrderItemEntity)
    private readonly poItemRepository: Repository<PurchaseOrderItemEntity>,
  ) {}

  async createSupplier(dto: CreateSupplierDto): Promise<SupplierEntity> {
    const supplier = this.supplierRepository.create(dto);
    return this.supplierRepository.save(supplier);
  }

  async findAllSuppliers(pagination: PaginationQueryDto): Promise<{
    data: SupplierEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.supplierRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { supplierId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOneSupplier(id: number): Promise<SupplierEntity> {
    const supplier = await this.supplierRepository.findOne({
      where: { supplierId: id },
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier #${id} not found`);
    }
    return supplier;
  }

  async updateSupplier(
    id: number,
    dto: UpdateSupplierDto,
  ): Promise<SupplierEntity> {
    const supplier = await this.findOneSupplier(id);
    Object.assign(supplier, dto);
    return this.supplierRepository.save(supplier);
  }

  async removeSupplier(id: number): Promise<void> {
    const supplier = await this.findOneSupplier(id);
    await this.supplierRepository.softRemove(supplier);
  }

  async createPurchaseOrder(
    dto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrderEntity> {
    const totalAmount = dto.items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.unitCost),
      0,
    );

    const po = this.poRepository.create({
      supplierId: dto.supplierId,
      branchId: dto.branchId,
      employeeId: dto.employeeId,
      orderDate: new Date(dto.orderDate),
      status: dto.status,
      totalAmount,
      items: dto.items.map((item) =>
        this.poItemRepository.create({
          productId: item.productId,
          quantity: item.quantity,
          unitCost: item.unitCost,
        }),
      ),
    });

    return this.poRepository.save(po);
  }

  async findAllPurchaseOrders(pagination: PaginationQueryDto): Promise<{
    data: PurchaseOrderEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.poRepository.findAndCount({
      relations: ['supplier', 'branch', 'employee', 'items', 'items.product'],
      skip: (page - 1) * limit,
      take: limit,
      order: { poId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOnePurchaseOrder(id: number): Promise<PurchaseOrderEntity> {
    const po = await this.poRepository.findOne({
      where: { poId: id },
      relations: ['supplier', 'branch', 'employee', 'items', 'items.product'],
    });
    if (!po) {
      throw new NotFoundException(`Purchase Order #${id} not found`);
    }
    return po;
  }

  async updatePurchaseOrder(
    id: number,
    dto: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrderEntity> {
    const po = await this.findOnePurchaseOrder(id);
    if (dto.status) {
      po.status = dto.status;
    }
    return this.poRepository.save(po);
  }
}
