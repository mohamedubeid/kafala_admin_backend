import { baseColumns } from '../helpers/migration-base';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
export class CreateSponsershipTypesTable1721736145510 implements MigrationInterface {
  private table = 'sponsership_types';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.table,
        columns: [
          ...baseColumns,
          {
            name: 'type',
            type: 'varchar',
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
