import { EntityRepository, Repository } from 'typeorm';
import { ChildPrticipations } from '../domain/child-prticipations.entity';

@EntityRepository(ChildPrticipations)
export class ChildPrticipationsRepository extends Repository<ChildPrticipations> {}
