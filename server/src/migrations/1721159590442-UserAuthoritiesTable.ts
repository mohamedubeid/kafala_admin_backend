import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UserAuthoritiesTable1721159590442 implements MigrationInterface {
  private table = 'jhi_user_authorities_jhi_authority';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.table,
        columns: [
          {
            name: 'jhiUserId',
            type: 'int4',
            isPrimary: true,
          },
          {
            name: 'jhiAuthorityName',
            type: 'varchar',
            isPrimary: true,
          },
        ],
      }),
      false,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${this.table}`);
  }
}
