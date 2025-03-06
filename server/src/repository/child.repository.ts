import { EntityRepository, Repository } from 'typeorm';
import { Child } from '../domain/child.entity';

@EntityRepository(Child)
export class ChildRepository extends Repository<Child> {}
