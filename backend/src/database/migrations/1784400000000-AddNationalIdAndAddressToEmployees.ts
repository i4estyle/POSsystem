import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNationalIdAndAddressToEmployees1784400000000 implements MigrationInterface {
  name = 'AddNationalIdAndAddressToEmployees1784400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`POS_EMPLOYEES\` ADD COLUMN \`EMP_NATIONAL_ID\` char(13) NULL UNIQUE COMMENT 'เลขบัตรประชาชน (13 หลัก)' AFTER \`EMP_PASSWORD_HASH\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_EMPLOYEES\` ADD COLUMN \`EMP_ADDRESS\` text NULL COMMENT 'ที่อยู่ปัจจุบันพนักงาน' AFTER \`EMP_NATIONAL_ID\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`POS_EMPLOYEES\` DROP COLUMN \`EMP_ADDRESS\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_EMPLOYEES\` DROP COLUMN \`EMP_NATIONAL_ID\``,
    );
  }
}
