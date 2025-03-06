import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildHealthStatusRepository } from '../repository/child-health-status.repository';
import { ChildHealthStatusExtendedService } from '../service/child-health-status.extend.service';
import { ChildHealthStatusExtendedController } from '../web/rest/child-health-status.extend.controller';
import { NotesRepository } from '../repository/notes.repository';
import { NotesService } from '../service/notes.service';
import { ChildHealthNotesRepository } from '../repository/child-health-notes.repository';
import { ChildHealthNotesService } from '../service/child-health-notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildHealthStatusRepository, NotesRepository, ChildHealthNotesRepository])],
  controllers: [ChildHealthStatusExtendedController],
  providers: [ChildHealthStatusExtendedService, NotesService, ChildHealthNotesService],
  exports: [ChildHealthStatusExtendedService, NotesService, ChildHealthNotesService],
})
export class ChildHealthStatusExtendedModule {}
