import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { SessionStatus } from '../../../common/enums';
import { QrCodeEntity } from './qr-code.entity';
import { DiningTableEntity } from '../../dining-tables/entities/dining-table.entity';
import { CustomerEntity } from '../../customers/entities/customer.entity';

@Entity('POS_TABLE_SESSIONS')
export class TableSessionEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'TSS_ID', comment: 'รหัสเซสชันโต๊ะ' })
  sessionId: number;

  @Column({ name: 'TSS_QR_CODE_ID', comment: 'รหัส QR Code ที่สแกนเปิดเซสชัน' })
  qrCodeId: number;

  @ManyToOne(() => QrCodeEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'TSS_QR_CODE_ID' })
  qrCode: QrCodeEntity;

  @Column({
    type: 'int',
    name: 'TSS_TABLE_ID',
    nullable: true,
    comment: 'รหัสโต๊ะอาหาร (null สำหรับ takeaway)',
  })
  tableId?: number | null;

  @ManyToOne(() => DiningTableEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'TSS_TABLE_ID' })
  table?: DiningTableEntity | null;

  @Column({
    type: 'int',
    name: 'TSS_CUSTOMER_ID',
    nullable: true,
    comment: 'รหัสลูกค้า (null หากลูกค้าไม่เข้าสู่ระบบ)',
  })
  customerId?: number | null;

  @ManyToOne(() => CustomerEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'TSS_CUSTOMER_ID' })
  customer?: CustomerEntity | null;

  @Column({
    name: 'TSS_GUEST_COUNT',
    type: 'int',
    default: 1,
    comment: 'จำนวนลูกค้าในโต๊ะ',
  })
  guestCount: number;

  @Column({
    name: 'TSS_STATUS',
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.ACTIVE,
    comment: 'สถานะเซสชัน (active/closed)',
  })
  sessionStatus: SessionStatus;

  @Column({
    name: 'TSS_STARTED_AT',
    type: 'datetime',
    comment: 'เวลาเปิดเซสชัน',
  })
  startedAt: Date;

  @Column({
    name: 'TSS_ENDED_AT',
    type: 'datetime',
    nullable: true,
    comment: 'เวลาปิดเซสชัน/เช็คบิล',
  })
  endedAt?: Date | null;
}
