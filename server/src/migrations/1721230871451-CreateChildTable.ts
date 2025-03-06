import { baseColumns } from '../helpers/migration-base';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateChildTable1721230871451 implements MigrationInterface {
  private table = 'child';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.table,
        columns: [
          ...baseColumns,
          {
            name: 'userId',
            type: 'int4',
            isNullable: true,
          },
          {
            name: 'father_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'father_phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'brother_code',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'mother_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'family_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'age',
            type: 'int4',
            isNullable: false,
          },
          {
            name: 'gender',
            type: 'enum',
            enum: ['MALE', 'FEMALE'],
            isNullable: false,
          },
          {
            name: 'vedio',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'address',
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
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jhi_user',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${this.table}`);
  }
}
