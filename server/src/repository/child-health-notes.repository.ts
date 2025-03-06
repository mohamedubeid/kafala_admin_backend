import { EntityRepository, Repository } from 'typeorm';
import { ChildHealthNotes } from '../domain/child-health-notes.entity';

@EntityRepository(ChildHealthNotes)
export class ChildHealthNotesRepository extends Repository<ChildHealthNotes> {}
