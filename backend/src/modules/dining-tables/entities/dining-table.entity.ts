import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DiningTableStatus } from '../../../common/enums';
import { BranchEntity } from '../../branches/entities/branch.entity';

@Entity('POS_DINING_TABLES')
export class DiningTableEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'DTB_ID', comment: 'รหัสโต๊ะอาหาร' })
  tableId: number;

  @Column({ name: 'DTB_BRANCH_ID', comment: 'รหัสสาขา' })
  branchId: number;

  @ManyToOne(() => BranchEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'DTB_BRANCH_ID' })
  branch: BranchEntity;

  @Column({
    name: 'DTB_NUMBER',
    type: 'varchar',
    length: 10,
    comment: 'หมายเลขโต๊ะ (เช่น T-01, A-02)',
  })
  tableNumber: string;

  @Column({
    name: 'DTB_SEAT_CAPACITY',
    type: 'int',
    comment: 'จำนวนที่นั่งสูงสุด',
  })
  seatCapacity: number;

  @Column({
    name: 'DTB_STATUS',
    type: 'enum',
    enum: DiningTableStatus,
    default: DiningTableStatus.AVAILABLE,
    comment: 'สถานะโต๊ะ (available/occupied/reserved)',
  })
  status: DiningTableStatus;
}
