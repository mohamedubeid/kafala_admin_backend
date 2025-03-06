import { INotes } from 'app/shared/model/notes.model';
import { IChildMaritalStatus } from 'app/shared/model/child-marital-status.model';

export interface IChildMaritalNotes {
  id?: number;
  notes?: INotes | null;
  childMaritalStatus?: IChildMaritalStatus | null;
}

export const defaultValue: Readonly<IChildMaritalNotes> = {};
