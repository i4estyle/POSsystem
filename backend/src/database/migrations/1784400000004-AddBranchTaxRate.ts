import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBranchTaxRate1784400000004 implements MigrationInterface {
  name = 'AddBranchTaxRate1784400000004';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `POS_BRANCH` ADD `BRN_TAX_RATE` decimal(5,4) NOT NULL DEFAULT 0',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `POS_BRANCH` DROP COLUMN `BRN_TAX_RATE`',
    );
  }
}
