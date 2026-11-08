import { randomUUID } from 'crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { uuidToBinary } from '../../common/utils/uuid-binary.util';

export class SecurePayment1784400000005 implements MigrationInterface {
  name = 'SecurePayment1784400000005';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `POS_PAYMENT` ADD `PAY_UUID` binary(16) NULL, ADD `PAY_REFUNDED_AMOUNT` decimal(10,2) NOT NULL DEFAULT 0, ADD `PAY_IDEMPOTENCY_KEY` char(36) NULL',
    );
    const payments = (await queryRunner.query(
      'SELECT `PAY_ID` AS paymentId FROM `POS_PAYMENT`',
    )) as Array<{ paymentId: number }>;
    for (const payment of payments) {
      await queryRunner.query(
        'UPDATE `POS_PAYMENT` SET `PAY_UUID` = ?, `PAY_IDEMPOTENCY_KEY` = ? WHERE `PAY_ID` = ?',
        [uuidToBinary(randomUUID()), randomUUID(), payment.paymentId],
      );
    }
    await queryRunner.query(
      'ALTER TABLE `POS_PAYMENT` MODIFY `PAY_UUID` binary(16) NOT NULL, MODIFY `PAY_IDEMPOTENCY_KEY` char(36) NOT NULL, ADD UNIQUE INDEX `UQ_PAYMENT_UUID` (`PAY_UUID`), ADD UNIQUE INDEX `UQ_PAYMENT_IDEMPOTENCY` (`PAY_IDEMPOTENCY_KEY`)',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `POS_PAYMENT` DROP INDEX `UQ_PAYMENT_IDEMPOTENCY`, DROP INDEX `UQ_PAYMENT_UUID`, DROP COLUMN `PAY_IDEMPOTENCY_KEY`, DROP COLUMN `PAY_REFUNDED_AMOUNT`, DROP COLUMN `PAY_UUID`',
    );
  }
}
