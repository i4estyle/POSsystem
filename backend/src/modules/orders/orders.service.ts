import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderStatusHistoryEntity } from './entities/order-status-history.entity';
import { OrderNotificationEntity } from './entities/order-notification.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { OrderStatus } from '../../common/enums';

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
  ) {}

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(100 + Math.random() * 900);
    return `ORD-${timestamp}-${random}`;
  }

  async create(dto: CreateOrderDto): Promise<OrderEntity> {
    const orderNumber = this.generateOrderNumber();
    const discountAmount = dto.discountAmount ?? 0;
    const taxAmount = dto.taxAmount ?? 0;

    const items = dto.items.map((item) => {
      const discount = item.discount ?? 0;
      const subtotal =
        Number(item.unitPrice) * Number(item.quantity) - Number(discount);
      return this.orderItemRepository.create({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount,
        subtotal,
        note: item.note,
      });
    });

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0,
    );
    const netAmount = totalAmount - Number(discountAmount) + Number(taxAmount);

    const order = this.orderRepository.create({
      orderNumber,
      branchId: dto.branchId,
      customerId: dto.customerId,
      employeeId: dto.employeeId,
      tableId: dto.tableId,
      promotionId: dto.promotionId,
      sessionId: dto.sessionId,
      qrCodeId: dto.qrCodeId,
      orderChannel: dto.orderChannel,
      orderType: dto.orderType,
      guestName: dto.guestName,
      guestPhone: dto.guestPhone,
      totalAmount,
      discountAmount,
      taxAmount,
      netAmount,
      orderDate: new Date(),
      status: OrderStatus.PENDING,
      items,
    });

    const savedOrder = await this.orderRepository.save(order);

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
    const limit = pagination.limit ?? 10;
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
