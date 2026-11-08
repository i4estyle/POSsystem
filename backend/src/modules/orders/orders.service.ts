import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DataSource, In, Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import {
  OrderChannel,
  OrderStatus,
  OrderType,
  PromotionStatus,
  PromotionType,
  RoleName,
} from '../../common/enums';
import { AuthPrincipal } from '../../common/interfaces/auth-principal.interface';
import {
  assertBranchAccess,
  resolveBranchId,
} from '../../common/utils/access-scope.util';
import { BranchEntity } from '../branches/entities/branch.entity';
import { CustomerEntity } from '../customers/entities/customer.entity';
import { DiningTableEntity } from '../dining-tables/entities/dining-table.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { PromotionEntity } from '../promotions/entities/promotion.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderNotificationEntity } from './entities/order-notification.entity';
import { OrderStatusHistoryEntity } from './entities/order-status-history.entity';
import { OrderEntity } from './entities/order.entity';

const ORDER_NUMBER_PREFIX = 'ORD';
const MONEY_SCALE = 100;
const STATUS_TRANSITIONS: Readonly<
  Record<OrderStatus, readonly OrderStatus[]>
> = {
  [OrderStatus.PENDING]: [
    OrderStatus.CONFIRMED,
    OrderStatus.PREPARING,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
  [OrderStatus.READY]: [OrderStatus.SERVED, OrderStatus.CANCELLED],
  [OrderStatus.SERVED]: [OrderStatus.PAID],
  [OrderStatus.PAID]: [],
  [OrderStatus.CANCELLED]: [],
};

interface CalculatedOrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  note: string | null;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    dto: CreateOrderDto,
    principal?: AuthPrincipal,
  ): Promise<OrderEntity> {
    if (!principal && !dto.branchId) {
      throw new BadRequestException('branchId is required');
    }
    const branchId = principal
      ? resolveBranchId(principal, dto.branchId)
      : (dto.branchId as number);
    const employeeId = principal?.employeeId ?? dto.employeeId ?? null;
    const productIds = [...new Set(dto.items.map((item) => item.productId))];
    const products = await this.dataSource.getRepository(ProductEntity).find({
      where: { productId: In(productIds) },
    });
    if (products.length !== productIds.length) {
      throw new BadRequestException('Order contains an invalid product');
    }
    const priceByProductId = new Map(
      products.map((product) => [
        product.productId,
        Number(product.sellingPrice),
      ]),
    );
    const items = dto.items.map((item): CalculatedOrderItem => {
      const unitPrice = priceByProductId.get(item.productId);
      if (unitPrice === undefined) {
        throw new BadRequestException('Order contains an invalid product');
      }
      const subtotal = this.roundMoney(unitPrice * item.quantity);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        discount: 0,
        subtotal,
        note: item.note ?? null,
      };
    });
    const totalAmount = this.roundMoney(
      items.reduce((sum, item) => sum + item.subtotal, 0),
    );
    const promotion = await this.resolvePromotion(dto.promotionId, totalAmount);
    const discountAmount = this.calculatePromotionDiscount(
      promotion,
      totalAmount,
    );
    const branch = await this.dataSource.getRepository(BranchEntity).findOne({
      where: { branchId },
    });
    if (!branch) throw new BadRequestException('Invalid branch');
    await this.validateReferences(dto, branchId);
    const taxableAmount = Math.max(0, totalAmount - discountAmount);
    const taxAmount = this.roundMoney(taxableAmount * Number(branch.taxRate));
    const netAmount = this.roundMoney(taxableAmount + taxAmount);

    const savedId = await this.dataSource.transaction(async (manager) => {
      const orderRepository = manager.getRepository(OrderEntity);
      const savedOrder = await orderRepository.save(
        orderRepository.create({
          orderNumber: this.generateOrderNumber(branchId),
          branchId,
          customerId: dto.customerId ?? null,
          employeeId,
          tableId: dto.tableId ?? null,
          promotionId: promotion?.promotionId ?? null,
          sessionId: dto.sessionId ?? null,
          qrCodeId: dto.qrCodeId ?? null,
          orderChannel: dto.orderChannel ?? OrderChannel.POS,
          orderType: dto.orderType ?? OrderType.DINE_IN,
          guestName: dto.guestName ?? null,
          guestPhone: dto.guestPhone ?? null,
          totalAmount,
          discountAmount,
          taxAmount,
          netAmount,
          orderDate: new Date(),
          status: OrderStatus.PENDING,
        }),
      );
      const itemRepository = manager.getRepository(OrderItemEntity);
      await itemRepository.save(
        items.map((item) =>
          itemRepository.create({ ...item, orderId: savedOrder.orderId }),
        ),
      );
      const historyRepository = manager.getRepository(OrderStatusHistoryEntity);
      await historyRepository.save(
        historyRepository.create({
          orderId: savedOrder.orderId,
          status: OrderStatus.PENDING,
          changedByEmployeeId: employeeId,
          changedAt: new Date(),
        }),
      );
      const notificationRepository = manager.getRepository(
        OrderNotificationEntity,
      );
      await notificationRepository.save(
        notificationRepository.create({
          orderId: savedOrder.orderId,
          branchId,
          message: savedOrder.orderNumber,
          isRead: false,
        }),
      );
      return savedOrder.orderId;
    });
    return this.findOne(savedId, principal);
  }

  async findAll(
    pagination: PaginationQueryDto,
    principal: AuthPrincipal,
  ): Promise<{
    data: OrderEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const [data, total] = await this.orderRepository.findAndCount({
      where:
        principal.roleName === RoleName.ADMIN
          ? undefined
          : { branchId: principal.branchId },
      relations: [
        'customer',
        'employee',
        'table',
        'promotion',
        'items',
        'items.product',
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: { orderId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number, principal?: AuthPrincipal): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { orderId: id },
      relations: [
        'customer',
        'employee',
        'table',
        'promotion',
        'items',
        'items.product',
        'statusHistory',
      ],
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    if (principal) assertBranchAccess(principal, order.branchId);
    return order;
  }

  async findPublicOrdersByQr(
    qrCodeId: number,
    sessionId?: number,
    tableId?: number,
  ): Promise<OrderEntity[]> {
    const qb = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('order.table', 'table')
      .leftJoinAndSelect('order.promotion', 'promotion')
      .orderBy('order.orderId', 'ASC');

    if (sessionId) {
      qb.where(
        '(order.sessionId = :sessionId OR (order.qrCodeId = :qrCodeId AND order.sessionId IS NULL))',
        { sessionId, qrCodeId },
      );
    } else if (tableId) {
      qb.where(
        '(order.qrCodeId = :qrCodeId OR order.tableId = :tableId)',
        { qrCodeId, tableId },
      );
    } else {
      qb.where('order.qrCodeId = :qrCodeId', { qrCodeId });
    }

    return qb.getMany();
  }

  async findOneByExternalId(
    externalId: string,
    principal: AuthPrincipal,
  ): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({ where: { externalId } });
    if (!order) throw new NotFoundException('Order not found');
    assertBranchAccess(principal, order.branchId);
    return this.findOne(order.orderId, principal);
  }

  async updateStatus(
    id: number,
    dto: UpdateOrderStatusDto,
    principal: AuthPrincipal,
  ): Promise<OrderEntity> {
    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(OrderEntity);
      const order = await repository
        .createQueryBuilder('order')
        .setLock('pessimistic_write')
        .where('order.orderId = :id', { id })
        .getOne();
      if (!order) throw new NotFoundException(`Order #${id} not found`);
      assertBranchAccess(principal, order.branchId);
      if (!STATUS_TRANSITIONS[order.status].includes(dto.status)) {
        throw new BadRequestException(
          `Invalid order transition ${order.status} -> ${dto.status}`,
        );
      }
      order.status = dto.status;
      await repository.save(order);
      const historyRepository = manager.getRepository(OrderStatusHistoryEntity);
      await historyRepository.save(
        historyRepository.create({
          orderId: order.orderId,
          status: dto.status,
          changedByEmployeeId: principal.employeeId,
          note: dto.note ?? null,
          changedAt: new Date(),
        }),
      );
    });
    return this.findOne(id, principal);
  }

  private generateOrderNumber(branchId: number): string {
    const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
    const suffix = randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
    return `${ORDER_NUMBER_PREFIX}-${branchId}-${timestamp}-${suffix}`;
  }

  private roundMoney(value: number): number {
    return Math.round((value + Number.EPSILON) * MONEY_SCALE) / MONEY_SCALE;
  }

  private async resolvePromotion(
    promotionId: number | undefined,
    totalAmount: number,
  ): Promise<PromotionEntity | null> {
    if (!promotionId) return null;
    const promotion = await this.dataSource
      .getRepository(PromotionEntity)
      .findOne({ where: { promotionId } });
    if (!promotion || promotion.status !== PromotionStatus.ACTIVE) {
      throw new BadRequestException('Promotion is not active');
    }
    const today = new Date().toISOString().slice(0, 10);
    if (
      today < String(promotion.startDate) ||
      today > String(promotion.endDate) ||
      totalAmount < Number(promotion.minPurchaseAmount)
    ) {
      throw new BadRequestException('Promotion conditions are not met');
    }
    return promotion;
  }

  private calculatePromotionDiscount(
    promotion: PromotionEntity | null,
    totalAmount: number,
  ): number {
    if (!promotion) return 0;
    if (promotion.promotionType === PromotionType.PERCENT) {
      return this.roundMoney(
        Math.min(
          totalAmount,
          (totalAmount * Number(promotion.discountValue)) / 100,
        ),
      );
    }
    if (promotion.promotionType === PromotionType.FIXED_AMOUNT) {
      return this.roundMoney(
        Math.min(totalAmount, Number(promotion.discountValue)),
      );
    }
    throw new BadRequestException(
      'Promotion type is not supported for this order',
    );
  }

  private async validateReferences(
    dto: CreateOrderDto,
    branchId: number,
  ): Promise<void> {
    if (dto.customerId) {
      const customer = await this.dataSource
        .getRepository(CustomerEntity)
        .findOneBy({ customerId: dto.customerId });
      if (!customer) throw new BadRequestException('Invalid customer');
    }
    if (dto.tableId) {
      const table = await this.dataSource
        .getRepository(DiningTableEntity)
        .findOneBy({ tableId: dto.tableId, branchId });
      if (!table) throw new BadRequestException('Invalid dining table');
    }
  }
}
