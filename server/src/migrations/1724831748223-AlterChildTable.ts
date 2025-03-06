import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterChildTable1724831748223 implements MigrationInterface {
  private table = 'child';
    public async up(queryRunner: QueryRunner): Promise<void> {
      if (await queryRunner.hasColumn(this.table, 'score')) {
        await queryRunner.dropColumn(this.table, 'score');

        await queryRunner.addColumn(
            this.table,
            new TableColumn({
                name: 'score',
                type: 'float',
                isNullable: true,
            }),
        );
    } else {
        await queryRunner.addColumn(
            this.table,
            new TableColumn({
                name: 'score',
                type: 'float',
                isNullable: true,
            }),
        );
    }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
