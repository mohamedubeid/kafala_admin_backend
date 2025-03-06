import { baseColumns } from '../helpers/migration-base';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UserTable1721159561446 implements MigrationInterface {
  private table = 'jhi_user';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.table,
        columns: [
          ...baseColumns,
          {
            name: 'login',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'firstName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'lastName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'mobile',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'activated',
            type: 'boolean',
            default: false,
          },
          {
            name: 'langKey',
            type: 'varchar',
            default: "'en'",
            isNullable: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'imageUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'activationKey',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'resetKey',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'resetDate',
            type: 'timestamp',
            isNullable: true,
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
