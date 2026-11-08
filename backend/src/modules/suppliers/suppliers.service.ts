import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import {
  MovementType,
  PurchaseOrderStatus,
  ReferenceType,
  RoleName,
} from '../../common/enums';
import { AuthPrincipal } from '../../common/interfaces/auth-principal.interface';
import {
  assertBranchAccess,
  resolveBranchId,
} from '../../common/utils/access-scope.util';
import { StockMovementEntity } from '../stocks/entities/stock-movement.entity';
import { StockEntity } from '../stocks/entities/stock.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { PurchaseOrderItemEntity } from './entities/purchase-order-item.entity';
import { PurchaseOrderEntity } from './entities/purchase-order.entity';
import { SupplierEntity } from './entities/supplier.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly supplierRepository: Repository<SupplierEntity>,
    @InjectRepository(PurchaseOrderEntity)
    private readonly poRepository: Repository<PurchaseOrderEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createSupplier(dto: CreateSupplierDto): Promise<SupplierEntity> {
    return this.supplierRepository.save(this.supplierRepository.create(dto));
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
    const supplier = await this.supplierRepository.findOneBy({
      supplierId: id,
    });
    if (!supplier) throw new NotFoundException(`Supplier #${id} not found`);
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
    await this.supplierRepository.softRemove(await this.findOneSupplier(id));
  }

  async createPurchaseOrder(
    dto: CreatePurchaseOrderDto,
    principal: AuthPrincipal,
  ): Promise<PurchaseOrderEntity> {
    const branchId = resolveBranchId(principal, dto.branchId);
    const totalAmount = dto.items.reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0,
    );
    const poId = await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(PurchaseOrderEntity);
      const po = await repository.save(
        repository.create({
          supplierId: dto.supplierId,
          branchId,
          employeeId: principal.employeeId,
          orderDate: new Date(dto.orderDate),
          status: PurchaseOrderStatus.PENDING,
          totalAmount,
        }),
      );
      const itemRepository = manager.getRepository(PurchaseOrderItemEntity);
      await itemRepository.save(
        dto.items.map((item) =>
          itemRepository.create({ ...item, poId: po.poId }),
        ),
      );
      return po.poId;
    });
    return this.findOnePurchaseOrder(poId, principal);
  }

  async findAllPurchaseOrders(
    pagination: PaginationQueryDto,
    principal: AuthPrincipal,
  ): Promise<{
    data: PurchaseOrderEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.poRepository.findAndCount({
      where:
        principal.roleName === RoleName.ADMIN
          ? undefined
          : { branchId: principal.branchId },
      relations: ['supplier', 'branch', 'employee', 'items', 'items.product'],
      skip: (page - 1) * limit,
      take: limit,
      order: { poId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOnePurchaseOrder(
    id: number,
    principal: AuthPrincipal,
  ): Promise<PurchaseOrderEntity> {
    const po = await this.poRepository.findOne({
      where: { poId: id },
      relations: ['supplier', 'branch', 'employee', 'items', 'items.product'],
    });
    if (!po) throw new NotFoundException(`Purchase Order #${id} not found`);
    assertBranchAccess(principal, po.branchId);
    return po;
  }

  async changePurchaseOrderStatus(
    id: number,
    status: PurchaseOrderStatus | undefined,
    principal: AuthPrincipal,
  ): Promise<PurchaseOrderEntity> {
    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(PurchaseOrderEntity);
      const po = await repository
        .createQueryBuilder('po')
        .leftJoinAndSelect('po.items', 'items')
        .setLock('pessimistic_write')
        .where('po.poId = :id', { id })
        .getOne();
      if (!po) throw new NotFoundException(`Purchase Order #${id} not found`);
      assertBranchAccess(principal, po.branchId);
      if (!status) {
        throw new BadRequestException('Purchase order status is required');
      }
      if (po.status !== PurchaseOrderStatus.PENDING) {
        throw new BadRequestException('Purchase order is already finalized');
      }
      if (status === PurchaseOrderStatus.RECEIVED) {
        for (const item of po.items) {
          const stockRepository = manager.getRepository(StockEntity);
          let stock = await stockRepository
            .createQueryBuilder('stock')
            .setLock('pessimistic_write')
            .where('stock.productId = :productId', {
              productId: item.productId,
            })
            .andWhere('stock.branchId = :branchId', { branchId: po.branchId })
            .getOne();
          if (!stock) {
            stock = stockRepository.create({
              productId: item.productId,
              branchId: po.branchId,
              quantity: 0,
              reorderLevel: 0,
            });
          }
          stock.quantity += item.quantity;
          await stockRepository.save(stock);
          const movementRepository = manager.getRepository(StockMovementEntity);
          await movementRepository.save(
            movementRepository.create({
              productId: item.productId,
              branchId: po.branchId,
              employeeId: principal.employeeId,
              movementType: MovementType.IN,
              quantity: item.quantity,
              referenceType: ReferenceType.PURCHASE_ORDER,
              referenceId: po.poId,
            }),
          );
        }
      } else if (status !== PurchaseOrderStatus.CANCELLED) {
        throw new BadRequestException('Invalid purchase order transition');
      }
      po.status = status;
      await repository.save(po);
    });
    return this.findOnePurchaseOrder(id, principal);
  }
}
