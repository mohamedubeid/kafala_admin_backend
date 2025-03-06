import { INotes } from 'app/shared/model/notes.model';
import { IChild } from 'app/shared/model/child.model';

export interface IChildNotes {
  id?: number;
  notes?: INotes | null;
  child?: IChild | null;
}

export const defaultValue: Readonly<IChildNotes> = {};
