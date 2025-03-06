import { EntityRepository, Repository } from 'typeorm';
import { ChildMaritalStatus } from '../domain/child-marital-status.entity';

@EntityRepository(ChildMaritalStatus)
export class ChildMaritalStatusRepository extends Repository<ChildMaritalStatus> {}
