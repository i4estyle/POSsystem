import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { EmployeeStatus } from '../../../common/enums';
import { BranchEntity } from '../../branches/entities/branch.entity';
import { RoleEntity } from '../../roles/entities/role.entity';

@Entity('POS_EMPLOYEES')
export class EmployeeEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'EMP_ID', comment: 'รหัสพนักงาน' })
  employeeId: number;

  @Column({ name: 'EMP_BRANCH_ID', comment: 'รหัสสาขาที่สังกัด' })
  branchId: number;

  @ManyToOne(() => BranchEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'EMP_BRANCH_ID' })
  branch: BranchEntity;

  @Column({ name: 'EMP_ROLE_ID', comment: 'รหัสตำแหน่ง' })
  roleId: number;

  @ManyToOne(() => RoleEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'EMP_ROLE_ID' })
  role: RoleEntity;

  @Column({
    name: 'EMP_FIRST_NAME',
    type: 'varchar',
    length: 50,
    comment: 'ชื่อพนักงาน',
  })
  firstName: string;

  @Column({
    name: 'EMP_LAST_NAME',
    type: 'varchar',
    length: 50,
    comment: 'นามสกุลพนักงาน',
  })
  lastName: string;

  @Column({
    name: 'EMP_TITLE_PREFIX',
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'คำนำหน้าชื่อ',
  })
  titlePrefix: string;

  @Column({
    name: 'EMP_PROFILE_IMAGE',
    type: 'text',
    nullable: true,
    comment: 'URL หรือ Base64 รูปโปรไฟล์พนักงาน',
  })
  profileImage: string;

  @Column({
    name: 'EMP_PHONE',
    type: 'varchar',
    length: 20,
    comment: 'เบอร์โทรศัพท์พนักงาน',
  })
  phone: string;

  @Column({
    name: 'EMP_EMAIL',
    type: 'varchar',
    length: 100,
    unique: true,
    comment: 'อีเมลพนักงาน',
  })
  email: string;

  @Column({
    name: 'EMP_USERNAME',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'ชื่อผู้ใช้สำหรับเข้าสู่ระบบ',
  })
  username: string;

  @Column({
    name: 'EMP_PASSWORD_HASH',
    type: 'varchar',
    length: 255,
    comment: 'รหัสผ่านที่เข้ารหัสแล้ว',
  })
  passwordHash: string;

  @Column({
    name: 'EMP_NATIONAL_ID',
    type: 'char',
    length: 13,
    nullable: true,
    unique: true,
    comment: 'เลขบัตรประชาชน (13 หลัก)',
  })
  nationalId: string;

  @Column({
    name: 'EMP_ADDRESS',
    type: 'text',
    nullable: true,
    comment: 'ที่อยู่ปัจจุบันพนักงาน',
  })
  address: string;

  @Column({
    name: 'EMP_HIRE_DATE',
    type: 'date',
    comment: 'วันที่เริ่มงาน',
  })
  hireDate: Date;

  @Column({
    name: 'EMP_STATUS',
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
    comment: 'สถานะพนักงาน (active/resigned/suspended)',
  })
  status: EmployeeStatus;
}
