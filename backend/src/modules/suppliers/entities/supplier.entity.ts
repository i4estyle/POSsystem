import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('POS_SUPPLIERS')
export class SupplierEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'SUP_ID', comment: 'รหัสซัพพลายเออร์' })
  supplierId: number;

  @Column({
    name: 'SUP_NAME',
    type: 'varchar',
    length: 100,
    comment: 'ชื่อซัพพลายเออร์/บริษัท',
  })
  supplierName: string;

  @Column({
    name: 'SUP_CONTACT_NAME',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'ชื่อผู้ติดต่อ',
  })
  contactName?: string | null;

  @Column({
    name: 'SUP_PHONE',
    type: 'varchar',
    length: 20,
    comment: 'เบอร์โทรศัพท์ซัพพลายเออร์',
  })
  phone: string;

  @Column({
    name: 'SUP_EMAIL',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'อีเมลซัพพลายเออร์',
  })
  email?: string | null;

  @Column({
    name: 'SUP_ADDRESS',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'ที่อยู่ซัพพลายเออร์',
  })
  address?: string | null;
}
