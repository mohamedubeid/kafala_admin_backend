import { Setting } from '../domain/setting.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterSettingTable1730808182892 implements MigrationInterface {
  key1: Setting = {
    key: 'donations_reach_children_without_expenses',
    value: '0',
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(queryRunner.manager.create<Setting>(Setting, this.key1));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
