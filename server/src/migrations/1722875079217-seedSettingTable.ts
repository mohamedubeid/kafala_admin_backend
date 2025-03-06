import { Setting } from '../domain/setting.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedSettingTable1722875079217 implements MigrationInterface {
  setting1: Setting = {
    key: 'aboutUs',
    value: 'هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص...',
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(queryRunner.manager.create<Setting>(Setting, this.setting1));
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
