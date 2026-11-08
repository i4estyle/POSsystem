import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import {
  OrderStatus,
  PaymentMethodStatus,
  PaymentStatus,
  RoleName,
} from '../../common/enums';
import { AuthPrincipal } from '../../common/interfaces/auth-principal.interface';
import { assertBranchAccess } from '../../common/utils/access-scope.util';
import { OrderEntity } from '../orders/entities/order.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethodEntity } from './entities/payment-method.entity';
import { PaymentEntity } from './entities/payment.entity';

const MONEY_TOLERANCE = 0.001;

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentMethodEntity)
    private readonly methodRepository: Repository<PaymentMethodEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createMethod(
    dto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    return this.methodRepository.save(this.methodRepository.create(dto));
  }

  async findAllMethods(pagination: PaginationQueryDto): Promise<{
    data: PaymentMethodEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.methodRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { paymentMethodId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOneMethod(id: number): Promise<PaymentMethodEntity> {
    const method = await this.methodRepository.findOneBy({
      paymentMethodId: id,
    });
    if (!method) throw new NotFoundException(`Payment method #${id} not found`);
    return method;
  }

  async updateMethod(
    id: number,
    dto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    const method = await this.findOneMethod(id);
    Object.assign(method, dto);
    return this.methodRepository.save(method);
  }

  async removeMethod(id: number): Promise<void> {
    const method = await this.findOneMethod(id);
    await this.methodRepository.softRemove(method);
  }

  async createPayment(
    dto: CreatePaymentDto,
    principal: AuthPrincipal,
  ): Promise<PaymentEntity> {
    const existing = await this.paymentRepository.findOneBy({
      idempotencyKey: dto.idempotencyKey,
    });
    if (existing) return this.findOnePayment(existing.paymentId, principal);
    const paymentId = await this.dataSource.transaction(async (manager) => {
      const orderRepository = manager.getRepository(OrderEntity);
      const order = await orderRepository
        .createQueryBuilder('order')
        .setLock('pessimistic_write')
        .where('order.orderId = :orderId', { orderId: dto.orderId })
        .getOne();
      if (!order)
        throw new NotFoundException(`Order #${dto.orderId} not found`);
      assertBranchAccess(principal, order.branchId);
      if ([OrderStatus.CANCELLED, OrderStatus.PAID].includes(order.status)) {
        throw new BadRequestException('Order does not accept payments');
      }
      const method = await manager
        .getRepository(PaymentMethodEntity)
        .findOneBy({
          paymentMethodId: dto.paymentMethodId,
        });
      if (!method || method.status !== PaymentMethodStatus.ACTIVE) {
        throw new BadRequestException('Payment method is not active');
      }
      const paidResult = await manager
        .getRepository(PaymentEntity)
        .createQueryBuilder('payment')
        .select('COALESCE(SUM(payment.amount), 0)', 'paid')
        .where('payment.orderId = :orderId', { orderId: dto.orderId })
        .andWhere('payment.status = :status', { status: PaymentStatus.SUCCESS })
        .getRawOne<{ paid: string }>();
      const alreadyPaid = Number(paidResult?.paid ?? 0);
      if (
        alreadyPaid + dto.amount - Number(order.netAmount) >
        MONEY_TOLERANCE
      ) {
        throw new BadRequestException('Payment exceeds outstanding balance');
      }
      const repository = manager.getRepository(PaymentEntity);
      let saved: PaymentEntity;
      try {
        saved = await repository.save(
          repository.create({
            ...dto,
            status: PaymentStatus.SUCCESS,
            paymentDate: new Date(),
            refundedAmount: 0,
          }),
        );
      } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('Duplicate')) {
          throw new ConflictException('Duplicate payment request');
        }
        throw error;
      }
      if (
        Math.abs(alreadyPaid + dto.amount - Number(order.netAmount)) <=
        MONEY_TOLERANCE
      ) {
        order.status = OrderStatus.PAID;
        await orderRepository.save(order);
      }
      return saved.paymentId;
    });
    return this.findOnePayment(paymentId, principal);
  }

  async refundPayment(
    id: number,
    dto: RefundPaymentDto,
    principal: AuthPrincipal,
  ): Promise<PaymentEntity> {
    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(PaymentEntity);
      const payment = await repository
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.order', 'order')
        .setLock('pessimistic_write')
        .where('payment.paymentId = :id', { id })
        .getOne();
      if (!payment) throw new NotFoundException(`Payment #${id} not found`);
      assertBranchAccess(principal, payment.order.branchId);
      if (payment.status !== PaymentStatus.SUCCESS) {
        throw new BadRequestException('Payment cannot be refunded');
      }
      const nextRefunded = Number(payment.refundedAmount) + dto.amount;
      if (nextRefunded - Number(payment.amount) > MONEY_TOLERANCE) {
        throw new BadRequestException('Refund exceeds payment amount');
      }
      payment.refundedAmount = nextRefunded;
      if (Math.abs(nextRefunded - Number(payment.amount)) <= MONEY_TOLERANCE) {
        payment.status = PaymentStatus.REFUNDED;
      }
      await repository.save(payment);
      if (payment.order.status === OrderStatus.PAID) {
        payment.order.status = OrderStatus.SERVED;
        await manager.getRepository(OrderEntity).save(payment.order);
      }
    });
    return this.findOnePayment(id, principal);
  }

  async findAllPayments(
    pagination: PaginationQueryDto,
    principal: AuthPrincipal,
  ): Promise<{
    data: PaymentEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const builder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.order', 'order')
      .leftJoinAndSelect('payment.paymentMethod', 'paymentMethod')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('payment.paymentId', 'DESC');
    if (principal.roleName !== RoleName.ADMIN) {
      builder.andWhere('order.branchId = :branchId', {
        branchId: principal.branchId,
      });
    }
    const [data, total] = await builder.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOnePayment(
    id: number,
    principal: AuthPrincipal,
  ): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findOne({
      where: { paymentId: id },
      relations: ['order', 'paymentMethod'],
    });
    if (!payment) throw new NotFoundException(`Payment #${id} not found`);
    assertBranchAccess(principal, payment.order.branchId);
    return payment;
  }
}
