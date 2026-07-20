import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileImageAndTitlePrefixToEmployees1784400000001 implements MigrationInterface {
  name = 'AddProfileImageAndTitlePrefixToEmployees1784400000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`POS_EMPLOYEES\` ADD COLUMN \`EMP_TITLE_PREFIX\` varchar(20) NULL COMMENT 'คำนำหน้าชื่อ' AFTER \`EMP_LAST_NAME\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_EMPLOYEES\` ADD COLUMN \`EMP_PROFILE_IMAGE\` text NULL COMMENT 'URL หรือ Base64 รูปโปรไฟล์พนักงาน' AFTER \`EMP_TITLE_PREFIX\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`POS_EMPLOYEES\` DROP COLUMN \`EMP_PROFILE_IMAGE\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_EMPLOYEES\` DROP COLUMN \`EMP_TITLE_PREFIX\``,
    );
  }
}
