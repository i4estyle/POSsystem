import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderStatusHistoryEntity } from './entities/order-status-history.entity';
import { OrderNotificationEntity } from './entities/order-notification.entity';
import { PromotionEntity } from '../promotions/entities/promotion.entity';
import { CustomerEntity } from '../customers/entities/customer.entity';
import { EmployeeEntity } from '../employees/entities/employee.entity';
import { DiningTableEntity } from '../dining-tables/entities/dining-table.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { OrderChannel, OrderStatus, OrderType } from '../../common/enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(OrderStatusHistoryEntity)
    private readonly historyRepository: Repository<OrderStatusHistoryEntity>,
    @InjectRepository(OrderNotificationEntity)
    private readonly notificationRepository: Repository<OrderNotificationEntity>,
    private readonly dataSource: DataSource,
  ) {}

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(10 + Math.random() * 90);
    return `QR-${timestamp}${random}`;
  }

  async create(dto: CreateOrderDto): Promise<OrderEntity> {
    const orderNumber = this.generateOrderNumber();
    const discountAmount = Number(dto.discountAmount ?? 0);
    const taxAmount = Number(dto.taxAmount ?? 0);

    const calculatedItems = dto.items.map((item) => {
      const discount = Number(item.discount ?? 0);
      const unitPrice = Number(item.unitPrice);
      const quantity = Number(item.quantity);
      const subtotal = unitPrice * quantity - discount;
      return {
        productId: item.productId,
        quantity,
        unitPrice,
        discount,
        subtotal,
        note: item.note ?? null,
      };
    });

    const totalAmount = calculatedItems.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0,
    );
    const netAmount = totalAmount - discountAmount + taxAmount;

    let validPromotionId: number | null = dto.promotionId ?? null;
    if (validPromotionId) {
      const promoExists = await this.dataSource
        .getRepository(PromotionEntity)
        .findOne({ where: { promotionId: validPromotionId } });
      if (!promoExists) validPromotionId = null;
    }

    let validCustomerId: number | null = dto.customerId ?? null;
    if (validCustomerId) {
      const cusExists = await this.dataSource
        .getRepository(CustomerEntity)
        .findOne({ where: { customerId: validCustomerId } });
      if (!cusExists) validCustomerId = null;
    }

    let validEmployeeId: number | null = dto.employeeId ?? null;
    if (validEmployeeId) {
      const empExists = await this.dataSource
        .getRepository(EmployeeEntity)
        .findOne({ where: { employeeId: validEmployeeId } });
      if (!empExists) validEmployeeId = null;
    }

    let validTableId: number | null = dto.tableId ?? null;
    if (validTableId) {
      const tblExists = await this.dataSource
        .getRepository(DiningTableEntity)
        .findOne({ where: { tableId: validTableId } });
      if (!tblExists) validTableId = null;
    }

    const order = this.orderRepository.create({
      orderNumber,
      branchId: dto.branchId || 1,
      customerId: validCustomerId,
      employeeId: validEmployeeId,
      tableId: validTableId,
      promotionId: validPromotionId,
      sessionId: dto.sessionId ?? null,
      qrCodeId: dto.qrCodeId ?? null,
      orderChannel: dto.orderChannel ?? OrderChannel.QR_ORDER,
      orderType: dto.orderType ?? OrderType.DINE_IN,
      guestName: dto.guestName ?? null,
      guestPhone: dto.guestPhone ?? null,
      totalAmount,
      discountAmount,
      taxAmount,
      netAmount,
      orderDate: new Date(),
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    const itemEntities = calculatedItems.map((item) =>
      this.orderItemRepository.create({
        orderId: savedOrder.orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        subtotal: item.subtotal,
        note: item.note,
      }),
    );
    await this.orderItemRepository.save(itemEntities);

    const history = this.historyRepository.create({
      orderId: savedOrder.orderId,
      status: OrderStatus.PENDING,
      changedByEmployeeId: dto.employeeId ?? null,
      note: 'ออร์เดอร์ถูกสร้างขึ้นในระบบ',
      changedAt: new Date(),
    });
    await this.historyRepository.save(history);

    const notification = this.notificationRepository.create({
      orderId: savedOrder.orderId,
      branchId: savedOrder.branchId,
      message: `มีออร์เดอร์ใหม่ #${savedOrder.orderNumber}`,
      isRead: false,
    });
    await this.notificationRepository.save(notification);

    return this.findOne(savedOrder.orderId);
  }

  async findAll(pagination: PaginationQueryDto): Promise<{
    data: OrderEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const [data, total] = await this.orderRepository.findAndCount({
      relations: [
        'branch',
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

  async findOne(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { orderId: id },
      relations: [
        'branch',
        'customer',
        'employee',
        'table',
        'promotion',
        'items',
        'items.product',
        'statusHistory',
        'statusHistory.changedByEmployee',
      ],
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<OrderEntity> {
    const order = await this.findOne(id);
    Object.assign(order, dto);
    return this.orderRepository.save(order);
  }

  async updateStatus(
    id: number,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderEntity> {
    const order = await this.findOne(id);
    order.status = dto.status;
    await this.orderRepository.save(order);

    const history = this.historyRepository.create({
      orderId: order.orderId,
      status: dto.status,
      changedByEmployeeId: dto.changedByEmployeeId ?? null,
      note: dto.note ?? `เปลี่ยนสถานะเป็น ${dto.status}`,
      changedAt: new Date(),
    });
    await this.historyRepository.save(history);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.softRemove(order);
  }
}
