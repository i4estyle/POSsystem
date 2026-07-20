import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { OrderStatus } from '../../../common/enums';
import { OrderEntity } from './order.entity';
import { EmployeeEntity } from '../../employees/entities/employee.entity';

@Entity('POS_ORDER_STATUS_HISTORY')
export class OrderStatusHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'OSH_ID',
    comment: 'รหัสประวัติการเปลี่ยนสถานะ',
  })
  historyId: number;

  @Column({ name: 'OSH_ORDER_ID', comment: 'รหัสคำสั่งซื้อ' })
  orderId: number;

  @ManyToOne(() => OrderEntity, (order) => order.statusHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'OSH_ORDER_ID' })
  order: OrderEntity;

  @Column({
    name: 'OSH_STATUS',
    type: 'enum',
    enum: OrderStatus,
    comment: 'สถานะที่เปลี่ยนไป',
  })
  status: OrderStatus;

  @Column({
    type: 'int',
    name: 'OSH_CHANGED_BY_EMP_ID',
    nullable: true,
    comment: 'รหัสพนักงานที่เปลี่ยนสถานะ (null หากเปลี่ยนโดยระบบ/ลูกค้า)',
  })
  changedByEmployeeId?: number | null;

  @ManyToOne(() => EmployeeEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'OSH_CHANGED_BY_EMP_ID' })
  changedByEmployee?: EmployeeEntity | null;

  @Column({
    name: 'OSH_NOTE',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'หมายเหตุการเปลี่ยนสถานะ',
  })
  note?: string | null;

  @Column({
    name: 'OSH_CHANGED_AT',
    type: 'datetime',
    comment: 'วันที่และเวลาที่เปลี่ยนสถานะ',
  })
  changedAt: Date;
}
