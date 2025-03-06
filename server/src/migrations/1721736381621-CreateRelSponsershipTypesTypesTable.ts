import { baseColumns } from '../helpers/migration-base';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateRelSponsershipTypesTypesTable1721736381621 implements MigrationInterface {
  private table = 'rel_sponsership_types';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.table,
        columns: [
          ...baseColumns,
          {
            name: 'ChildSponsorShipId',
            type: 'int4',
            isNullable: false,
          },
          {
            name: 'sponsershipTypeId',
            type: 'int4',
            isNullable: false,
          },
        ],
      }),
      false,
    );
    await queryRunner.createForeignKey(
      this.table,
      new TableForeignKey({
        columnNames: ['ChildSponsorShipId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'child_sponsor_ship',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      this.table,
      new TableForeignKey({
        columnNames: ['sponsershipTypeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sponsership_types',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${this.table}`);
  }
}
