import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PurchaseOrderStatus } from '../../../common/enums';
import { SupplierEntity } from './supplier.entity';
import { BranchEntity } from '../../branches/entities/branch.entity';
import { EmployeeEntity } from '../../employees/entities/employee.entity';
import { PurchaseOrderItemEntity } from './purchase-order-item.entity';

@Entity('POS_PURCHASE_ORDERS')
export class PurchaseOrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'POR_ID', comment: 'รหัสใบสั่งซื้อ' })
  poId: number;

  @Column({ name: 'POR_SUPPLIER_ID', comment: 'รหัสซัพพลายเออร์' })
  supplierId: number;

  @ManyToOne(() => SupplierEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'POR_SUPPLIER_ID' })
  supplier: SupplierEntity;

  @Column({ name: 'POR_BRANCH_ID', comment: 'รหัสสาขาที่สั่งซื้อ' })
  branchId: number;

  @ManyToOne(() => BranchEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'POR_BRANCH_ID' })
  branch: BranchEntity;

  @Column({ name: 'POR_EMPLOYEE_ID', comment: 'รหัสพนักงานผู้ทำรายการ' })
  employeeId: number;

  @ManyToOne(() => EmployeeEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'POR_EMPLOYEE_ID' })
  employee: EmployeeEntity;

  @Column({ name: 'POR_ORDER_DATE', type: 'date', comment: 'วันที่สั่งซื้อ' })
  orderDate: Date;

  @Column({
    name: 'POR_STATUS',
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.PENDING,
    comment: 'สถานะใบสั่งซื้อ (pending/received/cancelled)',
  })
  status: PurchaseOrderStatus;

  @Column({
    name: 'POR_TOTAL_AMOUNT',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'ราคารวมใบสั่งซื้อ',
  })
  totalAmount: number;

  @OneToMany(() => PurchaseOrderItemEntity, (item) => item.purchaseOrder, {
    cascade: true,
  })
  items: PurchaseOrderItemEntity[];
}
