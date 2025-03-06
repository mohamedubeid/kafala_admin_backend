import { baseColumns } from '../helpers/migration-base';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateChildSponsorShipNotesTable1721287865879 implements MigrationInterface {
  private table = 'child_sponsor_ship_notes';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.table,
        columns: [
          ...baseColumns,
          {
            name: 'notesId',
            type: 'int4',
            isNullable: false,
          },
          {
            name: 'childSponsorShipId',
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
        columnNames: ['notesId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'notes',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      this.table,
      new TableForeignKey({
        columnNames: ['childSponsorShipId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'child_sponsor_ship',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${this.table}`);
  }
}
