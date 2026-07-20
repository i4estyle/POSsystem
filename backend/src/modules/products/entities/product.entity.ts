import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ProductStatus } from '../../../common/enums';
import { CategoryEntity } from '../../categories/entities/category.entity';

@Entity('POS_PRODUCTS')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'PRD_ID', comment: 'รหัสสินค้า' })
  productId: number;

  @Column({ name: 'PRD_CATEGORY_ID', comment: 'รหัสหมวดหมู่สินค้า' })
  categoryId: number;

  @ManyToOne(() => CategoryEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'PRD_CATEGORY_ID' })
  category: CategoryEntity;

  @Column({
    name: 'PRD_NAME',
    type: 'varchar',
    length: 100,
    comment: 'ชื่อสินค้า',
  })
  productName: string;

  @Column({
    name: 'PRD_SKU',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'รหัส SKU สินค้า',
  })
  sku: string;

  @Column({
    name: 'PRD_BARCODE',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: true,
    comment: 'รหัสบาร์โค้ด',
  })
  barcode?: string | null;

  @Column({
    name: 'PRD_DESCRIPTION',
    type: 'text',
    nullable: true,
    comment: 'คำอธิบายสินค้า',
  })
  description?: string | null;

  @Column({
    name: 'PRD_COST_PRICE',
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'ราคาทุน',
  })
  costPrice: number;

  @Column({
    name: 'PRD_SELLING_PRICE',
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'ราคาขาย',
  })
  sellingPrice: number;

  @Column({
    name: 'PRD_UNIT',
    type: 'varchar',
    length: 20,
    comment: 'หน่วยนับ (แก้ว, ชิ้น, กก.)',
  })
  unit: string;

  @Column({
    name: 'PRD_IMAGE_URL',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'URL รูปภาพสินค้า',
  })
  imageUrl?: string | null;

  @Column({
    name: 'PRD_STATUS',
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
    comment: 'สถานะสินค้า (active/inactive)',
  })
  status: ProductStatus;
}
