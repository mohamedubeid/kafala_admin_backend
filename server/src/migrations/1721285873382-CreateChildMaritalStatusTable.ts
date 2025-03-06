import { baseColumns } from '../helpers/migration-base';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateChildMaritalStatusTable1721285873382 implements MigrationInterface {
  private table = 'child_marital_status';
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
            name: 'orphan_classification',
            type: 'enum',
            enum: ['FATHER_ORPHAN', 'MOTHER_ORPHAN', 'OTHER'],
            isNullable: false,
          },
          {
            name: 'father_date_of_death',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'date_of_beath_image',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'num_of_sibiling',
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
