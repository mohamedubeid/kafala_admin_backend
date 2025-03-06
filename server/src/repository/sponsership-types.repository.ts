import { EntityRepository, Repository } from 'typeorm';
import { SponsershipTypes } from '../domain/sponsership-types.entity';

@EntityRepository(SponsershipTypes)
export class SponsershipTypesRepository extends Repository<SponsershipTypes> {}
