import {MigrationInterface, QueryRunner} from "typeorm";
import { Authority } from '../domain/authority.entity';

export class AddChildGuardianRole1741769165512 implements MigrationInterface {

    role6: Authority = { name: 'ROLE_CHILD_GUARDIAN' };

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(queryRunner.manager.create<Authority>(Authority, this.role6));
    }

    // eslint-disable-next-line
    public async down(queryRunner: QueryRunner): Promise<void> {}

}
