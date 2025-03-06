import { Authority } from '../domain/authority.entity';
import { User } from '../domain/user.entity';
import { transformPassword } from '../security';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUsersRoles1724740007181 implements MigrationInterface {
  role1: Authority = { name: 'ROLE_ADMIN' };

  role2: Authority = { name: 'ROLE_USER' };

  role3: Authority = { name: 'ROLE_CHILD' };

  role4: Authority = { name: 'ROLE_ANONYMOUS' };
  role5: Authority = { name: 'ROLE_GUARANTOR' };

  user1: User = {
    login: 'admin',
    password: 'admin',
    firstName: 'Administrator',
    lastName: 'Administrator',
    email: 'admin@localhost.it',
    imageUrl: '',
    activated: true,
    langKey: 'en',
    createdBy: 'system',
    lastModifiedBy: 'system',
  };

  user2: User = {
    login: 'user',
    password: 'user',
    firstName: 'User',
    lastName: 'User',
    email: 'user@localhost.it',
    imageUrl: '',
    activated: true,
    langKey: 'en',
    createdBy: 'system',
    lastModifiedBy: 'system',
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    const role1 = await queryRunner.manager.save(queryRunner.manager.create<Authority>(Authority, this.role1));
    const role2 = await queryRunner.manager.save(queryRunner.manager.create<Authority>(Authority, this.role2));
    await queryRunner.manager.save(queryRunner.manager.create<Authority>(Authority, this.role3));
    await queryRunner.manager.save(queryRunner.manager.create<Authority>(Authority, this.role4));
    await queryRunner.manager.save(queryRunner.manager.create<Authority>(Authority, this.role5));
    await Promise.all([this.user1, this.user2].map(u => transformPassword(u)));

    this.user1.authorities = [role1];
    await queryRunner.manager.save(queryRunner.manager.create<User>(User, this.user1));
    this.user2.authorities = [role2];
    await queryRunner.manager.save(queryRunner.manager.create<User>(User, this.user2));
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<any> {}
}
