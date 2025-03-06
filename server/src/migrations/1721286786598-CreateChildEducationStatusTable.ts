import { baseColumns } from '../helpers/migration-base';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateChildEducationStatusTable1721286786598 implements MigrationInterface {
  private table = 'child_education_status';
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
            name: 'last_level_of_education',
            type: 'enum',
            enum: ['PRIMARY', 'SECONDARY', 'TERTIARY', 'VOCATIONAL', 'NONE'],
            isNullable: false,
          },
          {
            name: 'hoppy',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'last_level_of_education_image',
            type: 'varchar',
            isNullable: true,
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
