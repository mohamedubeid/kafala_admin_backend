import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from '../web/rest/notes.controller';
import { NotesRepository } from '../repository/notes.repository';
import { NotesService } from '../service/notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotesRepository])],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}
