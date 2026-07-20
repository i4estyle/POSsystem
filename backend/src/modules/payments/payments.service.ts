import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethodEntity } from './entities/payment-method.entity';
import { PaymentEntity } from './entities/payment.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { OrderStatus, PaymentStatus } from '../../common/enums';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentMethodEntity)
    private readonly methodRepository: Repository<PaymentMethodEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async createMethod(
    dto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    const method = this.methodRepository.create(dto);
    return this.methodRepository.save(method);
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
    const method = await this.methodRepository.findOne({
      where: { paymentMethodId: id },
    });
    if (!method) {
      throw new NotFoundException(`Payment method #${id} not found`);
    }
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

  async createPayment(dto: CreatePaymentDto): Promise<PaymentEntity> {
    const payment = this.paymentRepository.create({
      ...dto,
      paymentDate: new Date(),
    });
    const savedPayment = await this.paymentRepository.save(payment);

    if (savedPayment.status === PaymentStatus.SUCCESS) {
      const order = await this.orderRepository.findOne({
        where: { orderId: dto.orderId },
      });
      if (order) {
        order.status = OrderStatus.PAID;
        await this.orderRepository.save(order);
      }
    }

    return this.paymentRepository.findOne({
      where: { paymentId: savedPayment.paymentId },
      relations: ['order', 'paymentMethod'],
    }) as Promise<PaymentEntity>;
  }

  async findAllPayments(pagination: PaginationQueryDto): Promise<{
    data: PaymentEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.paymentRepository.findAndCount({
      relations: ['order', 'paymentMethod'],
      skip: (page - 1) * limit,
      take: limit,
      order: { paymentId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOnePayment(id: number): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findOne({
      where: { paymentId: id },
      relations: ['order', 'paymentMethod'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment #${id} not found`);
    }
    return payment;
  }

  async updatePayment(
    id: number,
    dto: UpdatePaymentDto,
  ): Promise<PaymentEntity> {
    const payment = await this.findOnePayment(id);
    Object.assign(payment, dto);
    return this.paymentRepository.save(payment);
  }
}
