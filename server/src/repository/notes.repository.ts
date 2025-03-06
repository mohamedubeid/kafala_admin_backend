import { EntityRepository, Repository } from 'typeorm';
import { Notes } from '../domain/notes.entity';

@EntityRepository(Notes)
export class NotesRepository extends Repository<Notes> {}
