import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PromotionStatus, PromotionType } from '../../../common/enums';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('POS_PROMOTIONS')
export class PromotionEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'PRM_ID', comment: 'รหัสโปรโมชั่น' })
  promotionId: number;

  @Column({
    name: 'PRM_NAME',
    type: 'varchar',
    length: 100,
    comment: 'ชื่อโปรโมชั่น',
  })
  promotionName: string;

  @Column({
    name: 'PRM_TYPE',
    type: 'enum',
    enum: PromotionType,
    comment: 'ประเภทโปรโมชั่น (percent/fixed_amount/buy_x_get_y)',
  })
  promotionType: PromotionType;

  @Column({
    name: 'PRM_DISCOUNT_VALUE',
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'มูลค่าส่วนลด (เปอร์เซ็นต์ หรือ จำนวนเงิน)',
  })
  discountValue: number;

  @Column({
    name: 'PRM_MIN_PURCHASE_AMOUNT',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'ยอดซื้อขั้นต่ำที่ได้รับโปรโมชั่น',
  })
  minPurchaseAmount: number;

  @Column({
    name: 'PRM_START_DATE',
    type: 'date',
    comment: 'วันที่เริ่มโปรโมชั่น',
  })
  startDate: Date;

  @Column({
    name: 'PRM_END_DATE',
    type: 'date',
    comment: 'วันที่สิ้นสุดโปรโมชั่น',
  })
  endDate: Date;

  @Column({
    name: 'PRM_STATUS',
    type: 'enum',
    enum: PromotionStatus,
    default: PromotionStatus.ACTIVE,
    comment: 'สถานะโปรโมชั่น (active/expired/disabled)',
  })
  status: PromotionStatus;

  @ManyToMany(() => ProductEntity)
  @JoinTable({
    name: 'POS_PROMOTION_PRODUCTS',
    joinColumn: {
      name: 'PRP_PROMOTION_ID',
      referencedColumnName: 'promotionId',
    },
    inverseJoinColumn: {
      name: 'PRP_PRODUCT_ID',
      referencedColumnName: 'productId',
    },
  })
  eligibleProducts: ProductEntity[];
}
