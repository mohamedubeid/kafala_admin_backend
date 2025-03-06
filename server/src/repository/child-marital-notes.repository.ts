import { EntityRepository, Repository } from 'typeorm';
import { ChildMaritalNotes } from '../domain/child-marital-notes.entity';

@EntityRepository(ChildMaritalNotes)
export class ChildMaritalNotesRepository extends Repository<ChildMaritalNotes> {}
