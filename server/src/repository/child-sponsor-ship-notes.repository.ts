import { EntityRepository, Repository } from 'typeorm';
import { ChildSponsorShipNotes } from '../domain/child-sponsor-ship-notes.entity';

@EntityRepository(ChildSponsorShipNotes)
export class ChildSponsorShipNotesRepository extends Repository<ChildSponsorShipNotes> {}
