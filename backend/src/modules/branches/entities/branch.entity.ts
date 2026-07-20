import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BranchStatus } from '../../../common/enums';

@Entity('POS_BRANCHES')
export class BranchEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'BRN_ID', comment: 'รหัสสาขา' })
  branchId: number;

  @Column({
    name: 'BRN_NAME',
    type: 'varchar',
    length: 100,
    comment: 'ชื่อสาขา',
  })
  branchName: string;

  @Column({
    name: 'BRN_ADDRESS',
    type: 'varchar',
    length: 255,
    comment: 'ที่อยู่สาขา',
  })
  address: string;

  @Column({
    name: 'BRN_PHONE',
    type: 'varchar',
    length: 20,
    comment: 'เบอร์โทรศัพท์สาขา',
  })
  phone: string;

  @Column({
    name: 'BRN_STATUS',
    type: 'enum',
    enum: BranchStatus,
    default: BranchStatus.ACTIVE,
    comment: 'สถานะสาขา (active/inactive)',
  })
  status: BranchStatus;
}
