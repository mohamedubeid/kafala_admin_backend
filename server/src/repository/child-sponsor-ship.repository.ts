import { EntityRepository, Repository } from 'typeorm';
import { ChildSponsorShip } from '../domain/child-sponsor-ship.entity';

@EntityRepository(ChildSponsorShip)
export class ChildSponsorShipRepository extends Repository<ChildSponsorShip> {}
