import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamePromotionProduct1784400000003 implements MigrationInterface {
  name = 'RenamePromotionProduct1784400000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.renameTable(
      queryRunner,
      'POS_PROMOTION_PRODUCTS',
      'POS_PROMOTION_PRODUCT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.renameTable(
      queryRunner,
      'POS_PROMOTION_PRODUCT',
      'POS_PROMOTION_PRODUCTS',
    );
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
