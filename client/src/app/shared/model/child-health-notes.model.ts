import { INotes } from 'app/shared/model/notes.model';
import { IChildHealthStatus } from 'app/shared/model/child-health-status.model';

export interface IChildHealthNotes {
  id?: number;
  notes?: INotes | null;
  childHealthStatus?: IChildHealthStatus | null;
}

export const defaultValue: Readonly<IChildHealthNotes> = {};
