import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RequestStatus, RequestType } from '../../../common/enums';
import { TableSessionEntity } from './table-session.entity';
import { DiningTableEntity } from '../../dining-tables/entities/dining-table.entity';
import { EmployeeEntity } from '../../employees/entities/employee.entity';

@Entity('POS_TABLE_REQUESTS')
export class TableRequestEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'TRQ_ID', comment: 'รหัสรายการคำขอ' })
  requestId: number;

  @Column({ name: 'TRQ_SESSION_ID', comment: 'รหัสเซสชันโต๊ะ' })
  sessionId: number;

  @ManyToOne(() => TableSessionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'TRQ_SESSION_ID' })
  session: TableSessionEntity;

  @Column({ name: 'TRQ_TABLE_ID', comment: 'รหัสโต๊ะอาหาร' })
  tableId: number;

  @ManyToOne(() => DiningTableEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'TRQ_TABLE_ID' })
  table: DiningTableEntity;

  @Column({
    type: 'int',
    name: 'TRQ_HANDLED_BY_EMP_ID',
    nullable: true,
    comment: 'รหัสพนักงานที่เข้าดูแลคำขอ',
  })
  handledByEmployeeId?: number | null;

  @ManyToOne(() => EmployeeEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'TRQ_HANDLED_BY_EMP_ID' })
  handledByEmployee?: EmployeeEntity | null;

  @Column({
    name: 'TRQ_TYPE',
    type: 'enum',
    enum: RequestType,
    comment: 'ประเภทคำขอ (call_staff, request_bill, request_water, other)',
  })
  requestType: RequestType;

  @Column({
    name: 'TRQ_STATUS',
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
    comment: 'สถานะคำขอ (pending/acknowledged/done)',
  })
  status: RequestStatus;

  @Column({
    name: 'TRQ_RESOLVED_AT',
    type: 'datetime',
    nullable: true,
    comment: 'เวลาที่พนักงานดูแลสำเร็จ',
  })
  resolvedAt?: Date | null;
}
