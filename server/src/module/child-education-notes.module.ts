import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildEducationNotesController } from '../web/rest/child-education-notes.controller';
import { ChildEducationNotesRepository } from '../repository/child-education-notes.repository';
import { ChildEducationNotesService } from '../service/child-education-notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildEducationNotesRepository])],
  controllers: [ChildEducationNotesController],
  providers: [ChildEducationNotesService],
  exports: [ChildEducationNotesService],
})
export class ChildEducationNotesModule {}
