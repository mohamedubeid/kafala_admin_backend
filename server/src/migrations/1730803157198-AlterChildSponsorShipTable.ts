import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterChildSponsorShipTable1730803157198 implements MigrationInterface {
  private table = 'child_sponsor_ship';
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn(this.table, 'sponser_connection')) {
      await queryRunner.dropColumn(this.table, 'sponser_connection');

      await queryRunner.addColumn(
        this.table,
        new TableColumn({
          name: 'sponser_connection',
          type: 'enum',
          enum: ['Association', 'ORGANIZATION', 'OTHER'],
          isNullable: false,
        }),
      );
    } else {
      await queryRunner.addColumn(
        this.table,
        new TableColumn({
          name: 'sponser_connection',
          type: 'enum',
          enum: ['Association', 'ORGANIZATION', 'OTHER'],
          isNullable: false,
        }),
      );
    }
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
