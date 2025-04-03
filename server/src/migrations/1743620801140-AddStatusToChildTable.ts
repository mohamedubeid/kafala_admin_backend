import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddStatusToChildTable1743620801140 implements MigrationInterface {
    private table = 'child';

    public async up(queryRunner: QueryRunner): Promise<void> {



        if (await queryRunner.hasColumn(this.table, 'status')) {
            await queryRunner.dropColumn(this.table, 'status');
        }

        await queryRunner.addColumn(
            this.table,
            new TableColumn({
                name: 'status',
                type: 'enum',
                enum: ['PENDING', 'APPROVED', 'REJECTED'],
                isNullable: true,
                default: `'PENDING'`,
            }),
        );

        await queryRunner.query(`
            UPDATE ${this.table} SET status = 'APPROVED';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(this.table, 'status');
    }

}
