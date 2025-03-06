import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterChildEducationStatusTable1730885888765 implements MigrationInterface {
  private table = 'child_education_status';
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn(this.table, 'last_level_of_education')) {
      await queryRunner.dropColumn(this.table, 'last_level_of_education');

      await queryRunner.addColumn(
        this.table,
        new TableColumn({
          name: 'last_level_of_education',
          type: 'enum',
          enum: ['PRIMARY', 'INTERMEDIATE', 'SECONDARY', 'TERTIARY', 'VOCATIONAL', 'NONE'],
          isNullable: true,
        }),
      );
    } else {
      await queryRunner.addColumn(
        this.table,
        new TableColumn({
          name: 'last_level_of_education',
          type: 'enum',
          enum: ['PRIMARY', 'INTERMEDIATE', 'SECONDARY', 'TERTIARY', 'VOCATIONAL', 'NONE'],
          isNullable: false,
        }),
      );
    }
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
