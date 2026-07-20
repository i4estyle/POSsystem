import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { OrderEntity } from './order.entity';
import { BranchEntity } from '../../branches/entities/branch.entity';

@Entity('POS_ORDER_NOTIFICATIONS')
export class OrderNotificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'ONT_ID',
    comment: 'รหัสรายการแจ้งเตือน',
  })
  notificationId: number;

  @Column({ name: 'ONT_ORDER_ID', comment: 'รหัสคำสั่งซื้อ' })
  orderId: number;

  @ManyToOne(() => OrderEntity, (order) => order.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ONT_ORDER_ID' })
  order: OrderEntity;

  @Column({ name: 'ONT_BRANCH_ID', comment: 'รหัสสาขา' })
  branchId: number;

  @ManyToOne(() => BranchEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ONT_BRANCH_ID' })
  branch: BranchEntity;

  @Column({
    name: 'ONT_MESSAGE',
    type: 'varchar',
    length: 255,
    comment: 'ข้อความแจ้งเตือน',
  })
  message: string;

  @Column({
    name: 'ONT_IS_READ',
    type: 'boolean',
    default: false,
    comment: 'สถานะการอ่าน (true/false)',
  })
  isRead: boolean;
}
