import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './module/auth.module';
import ormConfig from './orm.config';
import { config } from './config';

import { ChildModule } from './module/child.module';
import { ChildHealthStatusModule } from './module/child-health-status.module';
import { ChildMaritalStatusModule } from './module/child-marital-status.module';
import { ChildEducationStatusModule } from './module/child-education-status.module';
import { ChildSponsorShipModule } from './module/child-sponsor-ship.module';
import { NotesModule } from './module/notes.module';
import { ChildHealthNotesModule } from './module/child-health-notes.module';
import { ChildMaritalNotesModule } from './module/child-marital-notes.module';
import { ChildEducationNotesModule } from './module/child-education-notes.module';
import { ChildSponsorShipNotesModule } from './module/child-sponsor-ship-notes.module';
import { MailModule } from './module/mail.module';
import { ChildExtendedModule } from './module/child.extend.module';
import { ChildHealthStatusExtendedModule } from './module/child-health-status.extend.module';
import { ChildMaritalStatusExtendedModule } from './module/child-marital-status.extend.module';
import { ChildEducationStatusExtendedModule } from './module/child-education-status.extend.module';
import { ChildSponsorShipExtendedModule } from './module/child-sponsor-ship.extend.module';
import { ChildNotesModule } from './module/child-notes.module';
import { SponsershipTypesModule } from './module/sponsership-types.module';
import { RelSponsershipTypesModule } from './module/rel-sponsership-types.module';
import { SettingModule } from './module/setting.module';
import { SettingExtendedModule } from './module/setting.extend.module';
import { ExtendedModule } from './module/extened.module';
import { KafeelModule } from './module/kafeel.module';
import { RelChildKafeelModule } from './module/rel-child-kafeel.module';
import { RelChildKafeelExtendedExtendedModule } from './module/rel-child-kafeel.extend.module';
import { KafeelExtendedModule } from './module/kafeel.extend.module';
import { ChildPrticipationsExtendedModule } from './module/child-prticipations.extend.module';
// jhipster-needle-add-entity-module-to-main-import - JHipster will import entity modules here, do not remove
// jhipster-needle-add-controller-module-to-main-import - JHipster will import controller modules here, do not remove
// jhipster-needle-add-service-module-to-main-import - JHipster will import service modules here, do not remove

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ormConfig,
    }),
    ServeStaticModule.forRoot({
      rootPath: config.getClientPath(),
    }),
    AuthModule,
    ChildModule,
    ChildHealthStatusModule,
    ChildMaritalStatusModule,
    ChildEducationStatusModule,
    ChildSponsorShipModule,
    NotesModule,
    ChildHealthNotesModule,
    ChildMaritalNotesModule,
    ChildEducationNotesModule,
    ChildSponsorShipNotesModule,
    MailModule,
    ChildExtendedModule,
    ChildHealthStatusExtendedModule,
    ChildMaritalStatusExtendedModule,
    ChildEducationStatusExtendedModule,
    ChildSponsorShipExtendedModule,
    ChildNotesModule,
    SponsershipTypesModule,
    RelSponsershipTypesModule,
    SettingModule,
    SettingExtendedModule,
    ExtendedModule,
    KafeelModule,
    RelChildKafeelModule,
    RelChildKafeelExtendedExtendedModule,
    KafeelExtendedModule,
    ChildPrticipationsExtendedModule
    // jhipster-needle-add-entity-module-to-main - JHipster will add entity modules here, do not remove
  ],
  controllers: [
    // jhipster-needle-add-controller-module-to-main - JHipster will add controller modules here, do not remove
  ],
  providers: [
    // jhipster-needle-add-service-module-to-main - JHipster will add service modules here, do not remove
  ],
})
export class AppModule {}
