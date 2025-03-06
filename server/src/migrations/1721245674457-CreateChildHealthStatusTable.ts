import { baseColumns } from '../helpers/migration-base';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateChildHealthStatusTable1721245674457 implements MigrationInterface {
  private table = 'child_health_status';
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
            name: 'health_status',
            type: 'enum',
            enum: ['GOOD', 'WEAK', 'POOR'],
            isNullable: true,
          },
          {
            name: 'chronic_disease',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'has_disability',
            type: 'int4',
            isNullable: false,
          },
          {
            name: 'disability_type',
            type: 'enum',
            enum: ['PHYSICAL', 'VISUAL', 'HEARING', 'COGNITIVE', 'OTHER'],
            isNullable: true,
          },
          {
            name: 'disability_image',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'has_mental_illness',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'mental_illness_type',
            type: 'enum',
            enum: ['DEPRESSION', 'ANXIETY', 'BIPOLAR_DISORDER', 'SCHIZOPHRENIA', 'PTSD', 'OCD', 'OTHER'],
            isNullable: true,
          },
          {
            name: 'mental_illness_image',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'sychological_health',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'sychological_health_type',
            type: 'enum',
            enum: ['STABLE', 'UNSTABLE', 'REQUIRES_COUNSELING', 'REQUIRES_THERAPY', 'CRITICAL', 'OTHER'],
            isNullable: true,
          },
          {
            name: 'sychological_health_image',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'health_report',
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
