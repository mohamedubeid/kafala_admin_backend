import { EntityRepository, Repository } from 'typeorm';
import { ChildEducationNotes } from '../domain/child-education-notes.entity';

@EntityRepository(ChildEducationNotes)
export class ChildEducationNotesRepository extends Repository<ChildEducationNotes> {}
