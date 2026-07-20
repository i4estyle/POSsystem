import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('POS_ROLES')
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'ROL_ID', comment: 'รหัสตำแหน่ง' })
  roleId: number;

  @Column({
    name: 'ROL_NAME',
    type: 'varchar',
    length: 50,
    comment: 'ชื่อตำแหน่ง (admin, manager, cashier, kitchen)',
  })
  roleName: string;

  @Column({
    name: 'ROL_DESCRIPTION',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'คำอธิบายตำแหน่ง',
  })
  description?: string | null;
}
