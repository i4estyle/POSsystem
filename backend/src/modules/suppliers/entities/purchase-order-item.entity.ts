import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PurchaseOrderEntity } from './purchase-order.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('POS_PURCHASE_ORDER_ITEMS')
export class PurchaseOrderItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'POI_ID',
    comment: 'รหัสรายการสินค้าในใบสั่งซื้อ',
  })
  poItemId: number;

  @Column({ name: 'POI_PO_ID', comment: 'รหัสใบสั่งซื้อ' })
  poId: number;

  @ManyToOne(() => PurchaseOrderEntity, (po) => po.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'POI_PO_ID' })
  purchaseOrder: PurchaseOrderEntity;

  @Column({ name: 'POI_PRODUCT_ID', comment: 'รหัสสินค้า' })
  productId: number;

  @ManyToOne(() => ProductEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'POI_PRODUCT_ID' })
  product: ProductEntity;

  @Column({ name: 'POI_QUANTITY', type: 'int', comment: 'จำนวนที่สั่งซื้อ' })
  quantity: number;

  @Column({
    name: 'POI_UNIT_COST',
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'ราคาทุนต่อหน่วย',
  })
  unitCost: number;
}
