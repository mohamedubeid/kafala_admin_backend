import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildNotesController } from '../web/rest/child-notes.controller';
import { ChildNotesRepository } from '../repository/child-notes.repository';
import { ChildNotesService } from '../service/child-notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildNotesRepository])],
  controllers: [ChildNotesController],
  providers: [ChildNotesService],
  exports: [ChildNotesService],
})
export class ChildNotesModule {}
