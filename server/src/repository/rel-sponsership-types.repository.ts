import { EntityRepository, Repository } from 'typeorm';
import { RelSponsershipTypes } from '../domain/rel-sponsership-types.entity';

@EntityRepository(RelSponsershipTypes)
export class RelSponsershipTypesRepository extends Repository<RelSponsershipTypes> {}
