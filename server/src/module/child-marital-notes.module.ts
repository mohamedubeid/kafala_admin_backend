import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildMaritalNotesController } from '../web/rest/child-marital-notes.controller';
import { ChildMaritalNotesRepository } from '../repository/child-marital-notes.repository';
import { ChildMaritalNotesService } from '../service/child-marital-notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildMaritalNotesRepository])],
  controllers: [ChildMaritalNotesController],
  providers: [ChildMaritalNotesService],
  exports: [ChildMaritalNotesService],
})
export class ChildMaritalNotesModule {}
