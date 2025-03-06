import { baseColumns } from '../helpers/migration-base';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateChildNotesTable1721632041534 implements MigrationInterface {
  private table = 'child_notes';
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
            name: 'childId',
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
        columnNames: ['childId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'child',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${this.table}`);
  }
}
