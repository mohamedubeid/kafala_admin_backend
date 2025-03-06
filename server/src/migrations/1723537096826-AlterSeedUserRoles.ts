import { Authority } from "../domain/authority.entity";
import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterSeedUserRoles1723537096826 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const roleOrganizational = { name: 'ROLE_ORGANIZATIONAL' };
    const roleAppManager = { name: 'ROLE_APP_MANAGER' };

    await queryRunner.manager.save(queryRunner.manager.create<Authority>(Authority, roleOrganizational));
    await queryRunner.manager.save(queryRunner.manager.create<Authority>(Authority, roleAppManager));
}

/* eslint-disable */
public async down(queryRunner: QueryRunner): Promise<void> {}

}
