import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterUserTable1724740007161 implements MigrationInterface {

  private table = 'jhi_user';
  public async up(queryRunner: QueryRunner): Promise<void> {
      if (await queryRunner.hasColumn(this.table, 'national_id')) {
          await queryRunner.dropColumn(this.table, 'national_id');

          await queryRunner.addColumn(
              this.table,
              new TableColumn({
                  name: 'national_id',
                  type: 'varchar',
                  isNullable: true,
              }),
          );
      } else {
          await queryRunner.addColumn(
              this.table,
              new TableColumn({
                  name: 'national_id',
                  type: 'varchar',
                  isNullable: true,
              }),
          );
      }
      if (await queryRunner.hasColumn(this.table, 'attachment')) {
        await queryRunner.dropColumn(this.table, 'attachment');

        await queryRunner.addColumn(
            this.table,
            new TableColumn({
                name: 'attachment',
                type: 'varchar',
                isNullable: true,
            }),
        );
    } else {
        await queryRunner.addColumn(
            this.table,
            new TableColumn({
                name: 'attachment',
                type: 'varchar',
                isNullable: true,
            }),
        );
    }
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE ${this.table}`);
  }

}
