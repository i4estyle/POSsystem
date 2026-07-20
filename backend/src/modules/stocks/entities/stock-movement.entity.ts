import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { MovementType, ReferenceType } from '../../../common/enums';
import { ProductEntity } from '../../products/entities/product.entity';
import { BranchEntity } from '../../branches/entities/branch.entity';
import { EmployeeEntity } from '../../employees/entities/employee.entity';

@Entity('POS_STOCK_MOVEMENTS')
export class StockMovementEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'STM_ID',
    comment: 'รหัสการเคลื่อนไหวสต็อก',
  })
  movementId: number;

  @Column({ name: 'STM_PRODUCT_ID', comment: 'รหัสสินค้า' })
  productId: number;

  @ManyToOne(() => ProductEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'STM_PRODUCT_ID' })
  product: ProductEntity;

  @Column({ name: 'STM_BRANCH_ID', comment: 'รหัสสาขา' })
  branchId: number;

  @ManyToOne(() => BranchEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'STM_BRANCH_ID' })
  branch: BranchEntity;

  @Column({ name: 'STM_EMPLOYEE_ID', comment: 'รหัสพนักงานผู้ดำเนินการ' })
  employeeId: number;

  @ManyToOne(() => EmployeeEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'STM_EMPLOYEE_ID' })
  employee: EmployeeEntity;

  @Column({
    name: 'STM_TYPE',
    type: 'enum',
    enum: MovementType,
    comment: 'ประเภทการเคลื่อนไหว (in/out/adjust)',
  })
  movementType: MovementType;

  @Column({ name: 'STM_QUANTITY', type: 'int', comment: 'จำนวนที่เคลื่อนไหว' })
  quantity: number;

  @Column({
    name: 'STM_REFERENCE_TYPE',
    type: 'enum',
    enum: ReferenceType,
    default: ReferenceType.MANUAL,
    comment: 'ประเภทเอกสารอ้างอิง (order/purchase_order/manual)',
  })
  referenceType: ReferenceType;

  @Column({
    type: 'int',
    name: 'STM_REFERENCE_ID',
    nullable: true,
    comment: 'รหัสเอกสารอ้างอิง',
  })
  referenceId?: number | null;

  @Column({
    name: 'STM_NOTE',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'หมายเหตุการปรับสต็อก',
  })
  note?: string | null;
}
