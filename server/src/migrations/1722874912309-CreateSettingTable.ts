import { baseColumns } from '../helpers/migration-base';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSettingTable1722874912309 implements MigrationInterface {
  private table = 'setting';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.table,
        columns: [
          ...baseColumns,
          {
            name: 'jhi_key',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'text',
            isNullable: false,
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
