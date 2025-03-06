import { baseColumns } from '../helpers/migration-base';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateRelChildKafeel1724065045929 implements MigrationInterface {
  private table = 'rel_child_kafeel';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.table,
        columns: [
          ...baseColumns,
          {
            name: 'childId',
            type: 'int4',
            isNullable: false,
          },
          {
            name: 'kafeelId',
            type: 'int4',
            isNullable: false,
          },
          {
            name: 'duration',
            type: 'enum',
            isNullable: false,
            enum: ['MONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL'],

          },
          {
            name: 'cost',
            type: 'float',
            isNullable: false,

          },
          {
            name: 'start_date',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'expiration_date',
            type: 'timestamp',
            isNullable: false,
          },
        ],
      }),
      false,
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
    await queryRunner.createForeignKey(
      this.table,
      new TableForeignKey({
        columnNames: ['kafeelId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'kafeel',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${this.table}`);
  }

}
