import { SponsershipTypes } from "../domain/sponsership-types.entity";
import {MigrationInterface, QueryRunner} from "typeorm";

export class seedSponsorShipTypesTable1724009045524 implements MigrationInterface {

  type1: SponsershipTypes = {
    id: 1,
    type: 'HEALTH',
    relSponsershipTypes:[]
  };
  type2: SponsershipTypes = {
    id: 2,
    type: 'SOCIAL',
    relSponsershipTypes:[]
  };
  type3: SponsershipTypes = {
    id: 3,
    type: 'FINANCIAL',
    relSponsershipTypes:[]
  };
  type4: SponsershipTypes = {
    id: 4,
    type: 'EDUCATIONAL',
    relSponsershipTypes:[]
  };
  type5: SponsershipTypes = {
    id: 5,
    type: 'OTHER',
    relSponsershipTypes:[]
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(queryRunner.manager.create<SponsershipTypes>(SponsershipTypes, this.type1));
    await queryRunner.manager.save(queryRunner.manager.create<SponsershipTypes>(SponsershipTypes, this.type2));
    await queryRunner.manager.save(queryRunner.manager.create<SponsershipTypes>(SponsershipTypes, this.type3));
    await queryRunner.manager.save(queryRunner.manager.create<SponsershipTypes>(SponsershipTypes, this.type4));
    await queryRunner.manager.save(queryRunner.manager.create<SponsershipTypes>(SponsershipTypes, this.type5));
  }

   // eslint-disable-next-line
   public async down(queryRunner: QueryRunner): Promise<void> {}

}
