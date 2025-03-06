import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterChildRelChildKafeelTable1725347484213 implements MigrationInterface {
  private table = 'rel_child_kafeel';
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn(this.table, 'status')) {
      await queryRunner.dropColumn(this.table, 'status');

      await queryRunner.addColumn(
        this.table,
        new TableColumn({
          name: 'status',
          type: 'enum',
          enum: ['ACCEPTED', 'REJECTED', 'PENDING'],
          isNullable: false,
        }),
      );
    } else {
      await queryRunner.addColumn(
        this.table,
        new TableColumn({
          name: 'status',
          type: 'enum',
          enum: ['ACCEPTED', 'REJECTED', 'PENDING'],
          isNullable: false,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
