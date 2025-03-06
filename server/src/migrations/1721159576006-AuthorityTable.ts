import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AuthorityTable1721159576006 implements MigrationInterface {
  private table = 'jhi_authority';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.table,
        columns: [
          {
            name: 'name',
            type: 'varchar',
            isPrimary: true,
          },
        ],
      }),
      false,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${this.table}`);
  }
}
