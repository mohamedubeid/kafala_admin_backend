import { INotes } from 'app/shared/model/notes.model';
import { IChildSponsorShip } from 'app/shared/model/child-sponsor-ship.model';

export interface IChildSponsorShipNotes {
  id?: number;
  notes?: INotes | null;
  childSponsorShip?: IChildSponsorShip | null;
}

export const defaultValue: Readonly<IChildSponsorShipNotes> = {};
