import { EntityRepository, Repository } from 'typeorm';
import { Kafeel } from '../domain/kafeel.entity';

@EntityRepository(Kafeel)
export class KafeelRepository extends Repository<Kafeel> {}
