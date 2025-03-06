import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildSponsorShipRepository } from '../repository/child-sponsor-ship.repository';
import { ChildSponsorShipExtendedService } from '../service/child-sponsor-ship.extend.service';
import { ChildSponsorShipExtendedController } from '../web/rest/child-sponsor-ship.extend.controller';
import { ChildSponsorShipNotesRepository } from '../repository/child-sponsor-ship-notes.repository';
import { ChildSponsorShipNotesService } from '../service/child-sponsor-ship-notes.service';
import { NotesService } from '../service/notes.service';
import { NotesRepository } from '../repository/notes.repository';
import { ChildSponsorShipNotesExtendedService } from '../service/child-sponsor-ship-notes.extend.service';
import { SponsershipTypesService } from '../service/sponsership-types.service';
import { SponsershipTypesRepository } from '../repository/sponsership-types.repository';
import { RelSponsershipTypesRepository } from '../repository/rel-sponsership-types.repository';
import { RelSponsershipTypesService } from '../service/rel-sponsership-types.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChildSponsorShipRepository,
      ChildSponsorShipNotesRepository,
      NotesRepository,
      ChildSponsorShipNotesRepository,
      SponsershipTypesRepository,
      RelSponsershipTypesRepository,
    ]),
  ],
  controllers: [ChildSponsorShipExtendedController],
  providers: [
    ChildSponsorShipExtendedService,
    ChildSponsorShipNotesService,
    NotesService,
    ChildSponsorShipNotesExtendedService,
    SponsershipTypesService,
    RelSponsershipTypesService,
  ],
  exports: [
    ChildSponsorShipExtendedService,
    ChildSponsorShipNotesService,
    NotesService,
    ChildSponsorShipNotesExtendedService,
    SponsershipTypesService,
    RelSponsershipTypesService,
  ],
})
export class ChildSponsorShipExtendedModule {}
