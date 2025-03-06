import { ISponsershipTypes } from 'app/shared/model/sponsership-types.model';
import { IChildSponsorShip } from 'app/shared/model/child-sponsor-ship.model';

export interface IRelSponsershipTypes {
  id?: number;
  sponsershipType?: ISponsershipTypes | null;
  childSponsorShip?: IChildSponsorShip | null;
}

export const defaultValue: Readonly<IRelSponsershipTypes> = {};
