import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AttendanceStatus } from '../../../common/enums';
import { EmployeeEntity } from '../../employees/entities/employee.entity';

@Entity('POS_ATTENDANCE')
export class AttendanceEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'ATT_ID',
    comment: 'รหัสบันทึกการเข้างาน',
  })
  attendanceId: number;

  @Column({ name: 'ATT_EMPLOYEE_ID', comment: 'รหัสพนักงาน' })
  employeeId: number;

  @ManyToOne(() => EmployeeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ATT_EMPLOYEE_ID' })
  employee: EmployeeEntity;

  @Column({ name: 'ATT_WORK_DATE', type: 'date', comment: 'วันที่ทำงาน' })
  workDate: Date;

  @Column({
    name: 'ATT_CHECK_IN',
    type: 'datetime',
    nullable: true,
    comment: 'เวลาเข้างาน',
  })
  checkIn?: Date | null;

  @Column({
    name: 'ATT_CHECK_OUT',
    type: 'datetime',
    nullable: true,
    comment: 'เวลาออกงาน',
  })
  checkOut?: Date | null;

  @Column({
    name: 'ATT_STATUS',
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.ON_TIME,
    comment: 'สถานะการเข้างาน (on_time/late/absent/leave)',
  })
  status: AttendanceStatus;
}
