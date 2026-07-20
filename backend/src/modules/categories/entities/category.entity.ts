import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('POS_CATEGORIES')
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'CAT_ID',
    comment: 'รหัสหมวดหมู่สินค้า',
  })
  categoryId: number;

  @Column({
    type: 'int',
    name: 'CAT_PARENT_ID',
    nullable: true,
    comment: 'รหัสหมวดหมู่แม่ (null หากเป็นหมวดหมู่หลัก)',
  })
  parentCategoryId?: number | null;

  @ManyToOne(() => CategoryEntity, (cat) => cat.children, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'CAT_PARENT_ID' })
  parent?: CategoryEntity | null;

  @OneToMany(() => CategoryEntity, (cat) => cat.parent)
  children: CategoryEntity[];

  @Column({
    name: 'CAT_NAME',
    type: 'varchar',
    length: 100,
    comment: 'ชื่อหมวดหมู่สินค้า',
  })
  categoryName: string;

  @Column({
    name: 'CAT_DESCRIPTION',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'คำอธิบายหมวดหมู่สินค้า',
  })
  description?: string | null;
}
