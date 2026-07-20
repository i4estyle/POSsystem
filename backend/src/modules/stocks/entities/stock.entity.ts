import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ProductEntity } from '../../products/entities/product.entity';
import { BranchEntity } from '../../branches/entities/branch.entity';

@Entity('POS_STOCKS')
@Index(['productId', 'branchId'], { unique: true })
export class StockEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'STK_ID', comment: 'รหัสรายการสต็อก' })
  stockId: number;

  @Column({ name: 'STK_PRODUCT_ID', comment: 'รหัสสินค้า' })
  productId: number;

  @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'STK_PRODUCT_ID' })
  product: ProductEntity;

  @Column({ name: 'STK_BRANCH_ID', comment: 'รหัสสาขา' })
  branchId: number;

  @ManyToOne(() => BranchEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'STK_BRANCH_ID' })
  branch: BranchEntity;

  @Column({
    name: 'STK_QUANTITY',
    type: 'int',
    default: 0,
    comment: 'จำนวนสินค้าคงเหลือ',
  })
  quantity: number;

  @Column({
    name: 'STK_REORDER_LEVEL',
    type: 'int',
    default: 0,
    comment: 'ระดับการสั่งซื้อใหม่ (Reorder Point)',
  })
  reorderLevel: number;
}
