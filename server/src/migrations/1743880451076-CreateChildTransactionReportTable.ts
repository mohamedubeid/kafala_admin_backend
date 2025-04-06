import { baseColumns } from '../helpers/migration-base';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateChildTransactionReportTable1743880451076 implements MigrationInterface {

    private table = 'child_transaction_report';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: this.table,
                columns: [
                    ...baseColumns,
                    {
                        name: 'childId',
                        type: 'int4',
                        isNullable: true,
                    },
                    {
                        name: 'amount_received',
                        type: 'float',
                        isNullable: true,
                    },
                    {
                        name: 'image',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'video',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'desceription',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['PENDING', 'APPROVED', 'REJECTED'],
                        isNullable: true,
                        default: `'PENDING'`,
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
