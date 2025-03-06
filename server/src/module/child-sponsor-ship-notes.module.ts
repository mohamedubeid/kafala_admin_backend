import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildSponsorShipNotesController } from '../web/rest/child-sponsor-ship-notes.controller';
import { ChildSponsorShipNotesRepository } from '../repository/child-sponsor-ship-notes.repository';
import { ChildSponsorShipNotesService } from '../service/child-sponsor-ship-notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildSponsorShipNotesRepository])],
  controllers: [ChildSponsorShipNotesController],
  providers: [ChildSponsorShipNotesService],
  exports: [ChildSponsorShipNotesService],
})
export class ChildSponsorShipNotesModule {}
