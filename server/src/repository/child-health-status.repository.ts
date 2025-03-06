import { EntityRepository, Repository } from 'typeorm';
import { ChildHealthStatus } from '../domain/child-health-status.entity';

@EntityRepository(ChildHealthStatus)
export class ChildHealthStatusRepository extends Repository<ChildHealthStatus> {}
