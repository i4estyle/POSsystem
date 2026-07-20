import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PaymentMethodStatus } from '../../../common/enums';

@Entity('POS_PAYMENT_METHODS')
export class PaymentMethodEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'PMT_ID',
    comment: 'รหัสช่องทางการชำระเงิน',
  })
  paymentMethodId: number;

  @Column({
    name: 'PMT_NAME',
    type: 'varchar',
    length: 50,
    comment: 'ชื่อช่องทางการชำระเงิน (cash, credit_card, promptpay, wallet)',
  })
  methodName: string;

  @Column({
    name: 'PMT_STATUS',
    type: 'enum',
    enum: PaymentMethodStatus,
    default: PaymentMethodStatus.ACTIVE,
    comment: 'สถานะช่องทาง (active/inactive)',
  })
  status: PaymentMethodStatus;
}
