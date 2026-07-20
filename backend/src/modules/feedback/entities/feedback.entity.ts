import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { CustomerEntity } from '../../customers/entities/customer.entity';
import { OrderEntity } from '../../orders/entities/order.entity';

@Entity('POS_FEEDBACK')
export class FeedbackEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'FDB_ID', comment: 'รหัสความคิดเห็น' })
  feedbackId: number;

  @Column({ name: 'FDB_CUSTOMER_ID', comment: 'รหัสลูกค้า' })
  customerId: number;

  @ManyToOne(() => CustomerEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'FDB_CUSTOMER_ID' })
  customer: CustomerEntity;

  @Column({
    type: 'int',
    name: 'FDB_ORDER_ID',
    nullable: true,
    unique: true,
    comment: 'รหัสคำสั่งซื้อ (1 ออร์เดอร์ มีได้ 1 ความคิดเห็น)',
  })
  orderId?: number | null;

  @OneToOne(() => OrderEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'FDB_ORDER_ID' })
  order?: OrderEntity | null;

  @Column({
    name: 'FDB_RATING',
    type: 'tinyint',
    comment: 'คะแนนความพึงพอใจ (1-5)',
  })
  rating: number;

  @Column({
    name: 'FDB_COMMENT',
    type: 'text',
    nullable: true,
    comment: 'ข้อความติชม/รีวิว',
  })
  comment?: string | null;
}
