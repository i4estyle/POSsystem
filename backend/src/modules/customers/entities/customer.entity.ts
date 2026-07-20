import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { MemberLevel } from '../../../common/enums';

@Entity('POS_CUSTOMERS')
export class CustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'CUS_ID', comment: 'รหัสลูกค้า' })
  customerId: number;

  @Column({
    name: 'CUS_FIRST_NAME',
    type: 'varchar',
    length: 50,
    comment: 'ชื่อลูกค้า',
  })
  firstName: string;

  @Column({
    name: 'CUS_LAST_NAME',
    type: 'varchar',
    length: 50,
    comment: 'นามสกุลลูกค้า',
  })
  lastName: string;

  @Column({
    name: 'CUS_PHONE',
    type: 'varchar',
    length: 20,
    unique: true,
    comment: 'เบอร์โทรศัพท์ลูกค้า',
  })
  phone: string;

  @Column({
    name: 'CUS_EMAIL',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'อีเมลลูกค้า',
  })
  email?: string | null;

  @Column({
    name: 'CUS_LOYALTY_POINT',
    type: 'int',
    default: 0,
    comment: 'แต้มสะสม',
  })
  loyaltyPoint: number;

  @Column({
    name: 'CUS_MEMBER_LEVEL',
    type: 'varchar',
    length: 20,
    default: MemberLevel.REGULAR,
    comment: 'ระดับสมาชิก (regular, silver, gold)',
  })
  memberLevel: string;

  @Column({
    name: 'CUS_REGISTER_DATE',
    type: 'datetime',
    comment: 'วันที่สมัครสมาชิก',
  })
  registerDate: Date;
}
