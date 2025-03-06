import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildEducationStatusRepository } from '../repository/child-education-status.repository';
import { ChildEducationStatusExtendedController } from '../web/rest/child-education-status.extend.controller';
import { ChildEducationStatusExtendedService } from '../service/child-education-status.extend.service';
import { NotesService } from '../service/notes.service';
import { NotesRepository } from '../repository/notes.repository';
import { ChildEducationNotesRepository } from '../repository/child-education-notes.repository';
import { ChildEducationNotesService } from '../service/child-education-notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildEducationStatusRepository, NotesRepository, ChildEducationNotesRepository])],
  controllers: [ChildEducationStatusExtendedController],
  providers: [ChildEducationStatusExtendedService, NotesService, ChildEducationNotesService],
  exports: [ChildEducationStatusExtendedService, NotesService, ChildEducationNotesService],
})
export class ChildEducationStatusExtendedModule {}
