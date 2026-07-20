import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { SalaryStatus } from '../../../common/enums';
import { EmployeeEntity } from '../../employees/entities/employee.entity';

@Entity('POS_SALARIES')
export class SalaryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'SAL_ID', comment: 'รหัสรายการเงินเดือน' })
  salaryId: number;

  @Column({ name: 'SAL_EMPLOYEE_ID', comment: 'รหัสพนักงาน' })
  employeeId: number;

  @ManyToOne(() => EmployeeEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'SAL_EMPLOYEE_ID' })
  employee: EmployeeEntity;

  @Column({
    name: 'SAL_PAY_MONTH',
    type: 'int',
    comment: 'เดือนที่จ่าย (1-12)',
  })
  payMonth: number;

  @Column({ name: 'SAL_PAY_YEAR', type: 'int', comment: 'ปีที่จ่าย (ค.ศ.)' })
  payYear: number;

  @Column({
    name: 'SAL_BASE_SALARY',
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'เงินเดือนพื้นฐาน',
  })
  baseSalary: number;

  @Column({
    name: 'SAL_BONUS',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'โบนัส',
  })
  bonus: number;

  @Column({
    name: 'SAL_DEDUCTION',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'หักเงิน',
  })
  deduction: number;

  @Column({
    name: 'SAL_NET_SALARY',
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'เงินสุทธิหลังหัก/บวกโบนัส',
  })
  netSalary: number;

  @Column({
    name: 'SAL_PAYMENT_DATE',
    type: 'date',
    nullable: true,
    comment: 'วันที่ชำระเงิน',
  })
  paymentDate?: Date | null;

  @Column({
    name: 'SAL_STATUS',
    type: 'enum',
    enum: SalaryStatus,
    default: SalaryStatus.PENDING,
    comment: 'สถานะการจ่ายเงินเดือน (pending/paid)',
  })
  status: SalaryStatus;
}
