import { EntityRepository, Repository } from 'typeorm';
import { ChildNotes } from '../domain/child-notes.entity';

@EntityRepository(ChildNotes)
export class ChildNotesRepository extends Repository<ChildNotes> {}
