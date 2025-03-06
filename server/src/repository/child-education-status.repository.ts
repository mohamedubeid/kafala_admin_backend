import { EntityRepository, Repository } from 'typeorm';
import { ChildEducationStatus } from '../domain/child-education-status.entity';

@EntityRepository(ChildEducationStatus)
export class ChildEducationStatusRepository extends Repository<ChildEducationStatus> {}
