import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { OrderItemStatus } from '../../../common/enums';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('POS_ORDER_ITEMS')
export class OrderItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'ORI_ID',
    comment: 'รหัสรายการสินค้าในคำสั่งซื้อ',
  })
  orderItemId: number;

  @Column({ name: 'ORI_ORDER_ID', comment: 'รหัสคำสั่งซื้อ' })
  orderId: number;

  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ORI_ORDER_ID' })
  order: OrderEntity;

  @Column({ name: 'ORI_PRODUCT_ID', comment: 'รหัสสินค้า' })
  productId: number;

  @ManyToOne(() => ProductEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ORI_PRODUCT_ID' })
  product: ProductEntity;

  @Column({ name: 'ORI_QUANTITY', type: 'int', comment: 'จำนวนสินค้า' })
  quantity: number;

  @Column({
    name: 'ORI_UNIT_PRICE',
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'ราคาขายต่อหน่วย ณ เวลาสั่งซื้อ',
  })
  unitPrice: number;

  @Column({
    name: 'ORI_DISCOUNT',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'ส่วนลดต่อรายการ',
  })
  discount: number;

  @Column({
    name: 'ORI_SUBTOTAL',
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'ยอดรวมของรายการนี้ ( (unit_price * quantity) - discount )',
  })
  subtotal: number;

  @Column({
    name: 'ORI_STATUS',
    type: 'enum',
    enum: OrderItemStatus,
    default: OrderItemStatus.PENDING,
    comment: 'สถานะรายการ (pending/preparing/ready/served)',
  })
  itemStatus: OrderItemStatus;

  @Column({
    name: 'ORI_NOTE',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'หมายเหตุพิเศษของเมนู (เช่น หวานน้อย, ไม่ใส่ผัก)',
  })
  note?: string | null;
}
