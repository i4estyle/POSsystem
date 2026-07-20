import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { OrderChannel, OrderStatus, OrderType } from '../../../common/enums';
import { BranchEntity } from '../../branches/entities/branch.entity';
import { CustomerEntity } from '../../customers/entities/customer.entity';
import { EmployeeEntity } from '../../employees/entities/employee.entity';
import { DiningTableEntity } from '../../dining-tables/entities/dining-table.entity';
import { PromotionEntity } from '../../promotions/entities/promotion.entity';
import { OrderItemEntity } from './order-item.entity';
import { OrderStatusHistoryEntity } from './order-status-history.entity';
import { OrderNotificationEntity } from './order-notification.entity';

@Entity('POS_ORDERS')
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'ORD_ID', comment: 'รหัสคำสั่งซื้อ' })
  orderId: number;

  @Column({
    name: 'ORD_NUMBER',
    type: 'varchar',
    length: 30,
    unique: true,
    comment: 'เลขที่ใบสั่งซื้อ (เช่น ORD-20250101-001)',
  })
  orderNumber: string;

  @Column({ name: 'ORD_BRANCH_ID', comment: 'รหัสสาขา' })
  branchId: number;

  @ManyToOne(() => BranchEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ORD_BRANCH_ID' })
  branch: BranchEntity;

  @Column({
    type: 'int',
    name: 'ORD_CUSTOMER_ID',
    nullable: true,
    comment: 'รหัสลูกค้า (null สำหรับผู้ไม่ได้สมัครสมาชิก)',
  })
  customerId?: number | null;

  @ManyToOne(() => CustomerEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ORD_CUSTOMER_ID' })
  customer?: CustomerEntity | null;

  @Column({
    type: 'int',
    name: 'ORD_EMPLOYEE_ID',
    nullable: true,
    comment: 'รหัสพนักงานผู้รับออร์เดอร์ (null หากลูกค้าสั่งผ่าน QR)',
  })
  employeeId?: number | null;

  @ManyToOne(() => EmployeeEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ORD_EMPLOYEE_ID' })
  employee?: EmployeeEntity | null;

  @Column({
    type: 'int',
    name: 'ORD_TABLE_ID',
    nullable: true,
    comment: 'รหัสโต๊ะอาหาร (null สำหรับ takeaway/delivery)',
  })
  tableId?: number | null;

  @ManyToOne(() => DiningTableEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ORD_TABLE_ID' })
  table?: DiningTableEntity | null;

  @Column({
    type: 'int',
    name: 'ORD_PROMOTION_ID',
    nullable: true,
    comment: 'รหัสโปรโมชั่นที่ใช้',
  })
  promotionId?: number | null;

  @ManyToOne(() => PromotionEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ORD_PROMOTION_ID' })
  promotion?: PromotionEntity | null;

  @Column({
    type: 'int',
    name: 'ORD_SESSION_ID',
    nullable: true,
    comment: 'รหัสเซสชันโต๊ะอาหาร (สำหรับ QR Order)',
  })
  sessionId?: number | null;

  @Column({
    type: 'int',
    name: 'ORD_QR_CODE_ID',
    nullable: true,
    comment: 'รหัส QR Code ที่สแกนสั่งซื้อ',
  })
  qrCodeId?: number | null;

  @Column({
    name: 'ORD_CHANNEL',
    type: 'enum',
    enum: OrderChannel,
    default: OrderChannel.POS,
    comment: 'ช่องทางการสั่งซื้อ (pos/qr_order)',
  })
  orderChannel: OrderChannel;

  @Column({
    name: 'ORD_TYPE',
    type: 'enum',
    enum: OrderType,
    default: OrderType.DINE_IN,
    comment: 'ประเภทการทาน (dine_in/takeaway/delivery)',
  })
  orderType: OrderType;

  @Column({
    name: 'ORD_STATUS',
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    comment:
      'สถานะออร์เดอร์ (pending/confirmed/preparing/ready/served/paid/cancelled)',
  })
  status: OrderStatus;

  @Column({
    name: 'ORD_GUEST_NAME',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'ชื่อผู้สั่งซื้อกรณีไม่มีบัญชีลูกค้า',
  })
  guestName?: string | null;

  @Column({
    name: 'ORD_GUEST_PHONE',
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'เบอร์โทรผู้สั่งซื้อกรณีไม่มีบัญชีลูกค้า',
  })
  guestPhone?: string | null;

  @Column({
    name: 'ORD_TOTAL_AMOUNT',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'ยอดรวมก่อนหักส่วนลด',
  })
  totalAmount: number;

  @Column({
    name: 'ORD_DISCOUNT_AMOUNT',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'ยอดส่วนลดรวม',
  })
  discountAmount: number;

  @Column({
    name: 'ORD_TAX_AMOUNT',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'ภาษีมูลค่าเพิ่ม (VAT)',
  })
  taxAmount: number;

  @Column({
    name: 'ORD_NET_AMOUNT',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'ยอดสุทธิที่ต้องชำระ',
  })
  netAmount: number;

  @Column({
    name: 'ORD_DATE',
    type: 'datetime',
    comment: 'วันที่และเวลาที่สั่งซื้อ',
  })
  orderDate: Date;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items: OrderItemEntity[];

  @OneToMany(() => OrderStatusHistoryEntity, (history) => history.order)
  statusHistory: OrderStatusHistoryEntity[];

  @OneToMany(() => OrderNotificationEntity, (noti) => noti.order)
  notifications: OrderNotificationEntity[];
}
