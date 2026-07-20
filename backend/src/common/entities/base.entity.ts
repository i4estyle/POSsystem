import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({
    name: 'CREATED_AT',
    type: 'datetime',
    comment: 'วันที่สร้างข้อมูล',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'UPDATED_AT',
    type: 'datetime',
    comment: 'วันที่แก้ไขข้อมูลล่าสุด',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'DELETED_AT',
    type: 'datetime',
    nullable: true,
    comment: 'วันที่ลบข้อมูล (Soft Delete)',
  })
  deletedAt?: Date | null;
}
