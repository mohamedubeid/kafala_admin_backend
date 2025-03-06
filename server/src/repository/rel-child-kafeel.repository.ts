import { EntityRepository, Repository } from 'typeorm';
import { RelChildKafeel } from '../domain/rel-child-kafeel.entity';

@EntityRepository(RelChildKafeel)
export class RelChildKafeelRepository extends Repository<RelChildKafeel> {}
