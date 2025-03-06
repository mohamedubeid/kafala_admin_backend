import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildHealthNotesController } from '../web/rest/child-health-notes.controller';
import { ChildHealthNotesRepository } from '../repository/child-health-notes.repository';
import { ChildHealthNotesService } from '../service/child-health-notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildHealthNotesRepository])],
  controllers: [ChildHealthNotesController],
  providers: [ChildHealthNotesService],
  exports: [ChildHealthNotesService],
})
export class ChildHealthNotesModule {}
