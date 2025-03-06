import { baseColumns } from '../helpers/migration-base';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateChildSponsorShipTable1721287467265 implements MigrationInterface {
  private table = 'child_sponsor_ship';
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
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'sponser_connection',
            type: 'enum',
            enum: ['DIRECT', 'INDIRECT', 'OTHER'],
            isNullable: false,
          },
          {
            name: 'sponsership_party',
            type: 'enum',
            enum: ['INDIVIDUAL', 'ORGANIZATION', 'OTHER'],
            isNullable: false,
          },
          {
            name: 'sponsership_duration',
            type: 'enum',
            enum: ['MONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL'],
            isNullable: false,
          },
          {
            name: 'sponsership_type',
            type: 'enum',
            enum: ['EDUCATIONAL', 'HEALTH', 'FINANCIAL', 'SOCIAL', 'OTHER'],
            isNullable: false,
          },
          {
            name: 'minimum_cost',
            type: 'float',
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
