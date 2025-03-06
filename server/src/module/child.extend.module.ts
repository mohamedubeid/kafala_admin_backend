import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildRepository } from '../repository/child.repository';
import { ChildExtendedService } from '../service/child.extend.service';
import { ChildExtendedController } from '../web/rest/child.extend.controller';
import { UserRepository } from '../repository/user.repository';
import { UserService } from '../service/user.service';
import { NotesService } from '../service/notes.service';
import { NotesRepository } from '../repository/notes.repository';
import { ChildNotesExtendedService } from '../service/child-notes.extend.service';
import { ChildNotesRepository } from '../repository/child-notes.repository';
import { ChildSponsorShipExtendedService } from '../service/child-sponsor-ship.extend.service';
import { ChildSponsorShipRepository } from '../repository/child-sponsor-ship.repository';
import { ChildHealthStatusExtendedService } from '../service/child-health-status.extend.service';
import { ChildHealthStatusRepository } from '../repository/child-health-status.repository';
import { ChildMaritalStatusExtendedService } from '../service/child-marital-status.extend.service';
import { ChildMaritalStatusRepository } from '../repository/child-marital-status.repository';
import { ChildEducationStatusExtendedService } from '../service/child-education-status.extend.service';
import { ChildEducationStatusRepository } from '../repository/child-education-status.repository';
import { SponsershipTypesRepository } from '../repository/sponsership-types.repository';
import { RelSponsershipTypesRepository } from '../repository/rel-sponsership-types.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChildRepository,
      UserRepository,
      NotesRepository,
      ChildNotesRepository,
      ChildSponsorShipRepository,
      ChildHealthStatusRepository,
      ChildMaritalStatusRepository,
      ChildEducationStatusRepository,
      SponsershipTypesRepository,
      RelSponsershipTypesRepository,
    ]),
  ],
  controllers: [ChildExtendedController],
  providers: [
    ChildExtendedService,
    UserService,
    NotesService,
    ChildNotesExtendedService,
    ChildSponsorShipExtendedService,
    ChildHealthStatusExtendedService,
    ChildMaritalStatusExtendedService,
    ChildEducationStatusExtendedService,
  ],
  exports: [ChildExtendedService, UserService, NotesService, ChildNotesExtendedService, ChildSponsorShipExtendedService],
})
export class ChildExtendedModule {}
