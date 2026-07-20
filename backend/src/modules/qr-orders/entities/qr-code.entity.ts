import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { QrCodeStatus, QrType } from '../../../common/enums';
import { BranchEntity } from '../../branches/entities/branch.entity';
import { DiningTableEntity } from '../../dining-tables/entities/dining-table.entity';

@Entity('POS_QR_CODES')
export class QrCodeEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'QRC_ID', comment: 'รหัส QR Code' })
  qrCodeId: number;

  @Column({ name: 'QRC_BRANCH_ID', comment: 'รหัสสาขา' })
  branchId: number;

  @ManyToOne(() => BranchEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'QRC_BRANCH_ID' })
  branch: BranchEntity;

  @Column({
    type: 'int',
    name: 'QRC_TABLE_ID',
    nullable: true,
    comment: 'รหัสโต๊ะอาหาร (null สำหรับ QR แบบ takeaway)',
  })
  tableId?: number | null;

  @ManyToOne(() => DiningTableEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'QRC_TABLE_ID' })
  table?: DiningTableEntity | null;

  @Column({
    name: 'QRC_TYPE',
    type: 'enum',
    enum: QrType,
    default: QrType.DINE_IN,
    comment: 'ประเภท QR (dine_in/takeaway)',
  })
  qrType: QrType;

  @Column({
    name: 'QRC_CODE_TOKEN',
    type: 'varchar',
    length: 100,
    unique: true,
    comment: 'โทเค็นสุ่มสำหรับสแกนเข้า URL สั่งอาหาร',
  })
  codeToken: string;

  @Column({
    name: 'QRC_STATUS',
    type: 'enum',
    enum: QrCodeStatus,
    default: QrCodeStatus.ACTIVE,
    comment: 'สถานะ QR (active/inactive)',
  })
  status: QrCodeStatus;
}
