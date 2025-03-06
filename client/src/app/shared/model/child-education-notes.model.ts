import { INotes } from 'app/shared/model/notes.model';
import { IChildEducationStatus } from 'app/shared/model/child-education-status.model';

export interface IChildEducationNotes {
  id?: number;
  notes?: INotes | null;
  childEducationStatus?: IChildEducationStatus | null;
}

export const defaultValue: Readonly<IChildEducationNotes> = {};
