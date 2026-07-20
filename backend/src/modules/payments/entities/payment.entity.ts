import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PaymentStatus } from '../../../common/enums';
import { OrderEntity } from '../../orders/entities/order.entity';
import { PaymentMethodEntity } from './payment-method.entity';

@Entity('POS_PAYMENTS')
export class PaymentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'PAY_ID', comment: 'รหัสรายการชำระเงิน' })
  paymentId: number;

  @Column({ name: 'PAY_ORDER_ID', comment: 'รหัสคำสั่งซื้อ' })
  orderId: number;

  @ManyToOne(() => OrderEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'PAY_ORDER_ID' })
  order: OrderEntity;

  @Column({ name: 'PAY_METHOD_ID', comment: 'รหัสช่องทางการชำระเงิน' })
  paymentMethodId: number;

  @ManyToOne(() => PaymentMethodEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'PAY_METHOD_ID' })
  paymentMethod: PaymentMethodEntity;

  @Column({
    name: 'PAY_AMOUNT',
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'จำนวนเงินที่ชำระ',
  })
  amount: number;

  @Column({
    name: 'PAY_REFERENCE_NO',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'เลขอ้างอิงธุรกรรม/สลิปโอนเงิน',
  })
  referenceNo?: string | null;

  @Column({
    name: 'PAY_STATUS',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.SUCCESS,
    comment: 'สถานะการชำระเงิน (success/failed/refunded)',
  })
  status: PaymentStatus;

  @Column({
    name: 'PAY_DATE',
    type: 'datetime',
    comment: 'วันที่และเวลาที่ชำระเงิน',
  })
  paymentDate: Date;
}
