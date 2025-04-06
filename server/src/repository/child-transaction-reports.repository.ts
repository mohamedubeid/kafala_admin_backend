import { EntityRepository, Repository } from 'typeorm';
import { ChildTransactionReports } from '../domain/child-transaction-reports.entity';

@EntityRepository(ChildTransactionReports)
export class ChildTransactionReportsRepository extends Repository<ChildTransactionReports> {}
