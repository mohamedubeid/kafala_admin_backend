import { IChild } from 'app/shared/model/child.model';
import { ChildTransactionRreportsStatus } from './enumerations/child-transaction-reports-status';

export interface IChildTransactionReports {
  id?: number;
  amount_received?: number | null;
  image?: string | null;
  video?: string | null;
  desceription?: string | null;
  status?: keyof typeof ChildTransactionRreportsStatus | null;
  child?: IChild | null;
}

export const defaultValue: Readonly<IChildTransactionReports> = {};
