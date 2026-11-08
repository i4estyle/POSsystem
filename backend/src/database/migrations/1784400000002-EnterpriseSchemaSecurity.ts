import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnterpriseSchemaSecurity1784400000002 implements MigrationInterface {
  name = 'EnterpriseSchemaSecurity1784400000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const renames: ReadonlyArray<readonly [string, string]> = [
      ['POS_BRANCHES', 'POS_BRANCH'],
      ['POS_ROLES', 'POS_ROLE'],
      ['POS_EMPLOYEES', 'POS_EMPLOYEE'],
      ['POS_CUSTOMERS', 'POS_CUSTOMER'],
      ['POS_CATEGORIES', 'POS_CATEGORY'],
      ['POS_PRODUCTS', 'POS_PRODUCT'],
      ['POS_STOCKS', 'POS_STOCK'],
      ['POS_STOCK_MOVEMENTS', 'POS_STOCK_MOVEMENT'],
      ['POS_SUPPLIERS', 'POS_SUPPLIER'],
      ['POS_PURCHASE_ORDERS', 'POS_PURCHASE_ORDER'],
      ['POS_PURCHASE_ORDER_ITEMS', 'POS_PURCHASE_ORDER_ITEM'],
      ['POS_PROMOTIONS', 'POS_PROMOTION'],
      ['POS_DINING_TABLES', 'POS_DINING_TABLE'],
      ['POS_ORDERS', 'POS_ORDER'],
      ['POS_ORDER_ITEMS', 'POS_ORDER_ITEM'],
      ['POS_ORDER_NOTIFICATIONS', 'POS_ORDER_NOTIFICATION'],
      ['POS_PAYMENTS', 'POS_PAYMENT'],
      ['POS_PAYMENT_METHODS', 'POS_PAYMENT_METHOD'],
      ['POS_SALARIES', 'POS_SALARY'],
      ['POS_QR_CODES', 'POS_QR_CODE'],
      ['POS_TABLE_SESSIONS', 'POS_TABLE_SESSION'],
      ['POS_TABLE_REQUESTS', 'POS_TABLE_REQUEST'],
    ];
    for (const [from, to] of renames) {
      await this.renameTable(queryRunner, from, to);
    }

    await this.addExternalId(queryRunner, 'POS_EMPLOYEE', 'EMP_UUID');
    await this.addExternalId(queryRunner, 'POS_CUSTOMER', 'CUS_UUID');
    await this.addExternalId(queryRunner, 'POS_ORDER', 'ORD_UUID');
    await this.addExternalId(queryRunner, 'POS_QR_CODE', 'QRC_UUID');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.dropExternalId(queryRunner, 'POS_QR_CODE', 'QRC_UUID');
    await this.dropExternalId(queryRunner, 'POS_ORDER', 'ORD_UUID');
    await this.dropExternalId(queryRunner, 'POS_CUSTOMER', 'CUS_UUID');
    await this.dropExternalId(queryRunner, 'POS_EMPLOYEE', 'EMP_UUID');

    const renames: ReadonlyArray<readonly [string, string]> = [
      ['POS_TABLE_REQUEST', 'POS_TABLE_REQUESTS'],
      ['POS_TABLE_SESSION', 'POS_TABLE_SESSIONS'],
      ['POS_QR_CODE', 'POS_QR_CODES'],
      ['POS_SALARY', 'POS_SALARIES'],
      ['POS_PAYMENT_METHOD', 'POS_PAYMENT_METHODS'],
      ['POS_PAYMENT', 'POS_PAYMENTS'],
      ['POS_ORDER_NOTIFICATION', 'POS_ORDER_NOTIFICATIONS'],
      ['POS_ORDER_ITEM', 'POS_ORDER_ITEMS'],
      ['POS_ORDER', 'POS_ORDERS'],
      ['POS_DINING_TABLE', 'POS_DINING_TABLES'],
      ['POS_PROMOTION', 'POS_PROMOTIONS'],
      ['POS_PURCHASE_ORDER_ITEM', 'POS_PURCHASE_ORDER_ITEMS'],
      ['POS_PURCHASE_ORDER', 'POS_PURCHASE_ORDERS'],
      ['POS_SUPPLIER', 'POS_SUPPLIERS'],
      ['POS_STOCK_MOVEMENT', 'POS_STOCK_MOVEMENTS'],
      ['POS_STOCK', 'POS_STOCKS'],
      ['POS_PRODUCT', 'POS_PRODUCTS'],
      ['POS_CATEGORY', 'POS_CATEGORIES'],
      ['POS_CUSTOMER', 'POS_CUSTOMERS'],
      ['POS_EMPLOYEE', 'POS_EMPLOYEES'],
      ['POS_ROLE', 'POS_ROLES'],
      ['POS_BRANCH', 'POS_BRANCHES'],
    ];
    for (const [from, to] of renames) {
      await this.renameTable(queryRunner, from, to);
    }
  }

  private async addExternalId(
    queryRunner: QueryRunner,
    table: string,
    column: string,
  ): Promise<void> {
    if (!(await queryRunner.hasColumn(table, column))) {
      await queryRunner.query(
        `ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` BINARY(16) NULL`,
      );
    }
    await queryRunner.query(
      `UPDATE \`${table}\` SET \`${column}\` = UUID_TO_BIN(UUID()) WHERE \`${column}\` IS NULL`,
    );
    const tableMetadata = await queryRunner.getTable(table);
    const hasUniqueIndex = tableMetadata?.indices.some(
      (index) => index.name === `UQ_${column}`,
    );
    if (!hasUniqueIndex) {
      await queryRunner.query(
        `ALTER TABLE \`${table}\` MODIFY \`${column}\` BINARY(16) NOT NULL, ADD CONSTRAINT \`UQ_${column}\` UNIQUE (\`${column}\`)`,
      );
    }
  }

  private async dropExternalId(
    queryRunner: QueryRunner,
    table: string,
    column: string,
  ): Promise<void> {
    if (await queryRunner.hasColumn(table, column)) {
      await queryRunner.query(
        `ALTER TABLE \`${table}\` DROP INDEX \`UQ_${column}\`, DROP COLUMN \`${column}\``,
      );
    }
  }

  private async renameTable(
    queryRunner: QueryRunner,
    from: string,
    to: string,
  ): Promise<void> {
    const sourceExists = await queryRunner.hasTable(from);
    const targetExists = await queryRunner.hasTable(to);
    if (sourceExists && !targetExists) {
      await queryRunner.query(`RENAME TABLE \`${from}\` TO \`${to}\``);
      return;
    }
    if (!sourceExists && targetExists) return;
    throw new Error(`Cannot rename ${from} to ${to}: unexpected table state`);
  }
}
