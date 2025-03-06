import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildMaritalStatusRepository } from '../repository/child-marital-status.repository';
import { ChildMaritalStatusExtendedService } from '../service/child-marital-status.extend.service';
import { ChildMaritalStatusExtendedController } from '../web/rest/child-marital-status.extend.controller';
import { NotesRepository } from '../repository/notes.repository';
import { NotesService } from '../service/notes.service';
import { ChildMaritalNotesRepository } from '../repository/child-marital-notes.repository';
import { ChildMaritalNotesService } from '../service/child-marital-notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildMaritalStatusRepository, NotesRepository, ChildMaritalNotesRepository])],
  controllers: [ChildMaritalStatusExtendedController],
  providers: [ChildMaritalStatusExtendedService, NotesService, ChildMaritalNotesService],
  exports: [ChildMaritalStatusExtendedService, NotesService, ChildMaritalNotesService],
})
export class ChildMaritalStatusExtendedModule {}
