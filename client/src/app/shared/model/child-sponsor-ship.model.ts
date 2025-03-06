import { IChild } from 'app/shared/model/child.model';
import { SponserConnection } from 'app/shared/model/enumerations/sponser-connection.model';
import { SponsershipParty } from 'app/shared/model/enumerations/sponsership-party.model';
import { SponsershipDuration } from 'app/shared/model/enumerations/sponsership-duration.model';

export interface IChildSponsorShip {
  id?: number;
  name?: string | null;
  sponserConnection?: keyof typeof SponserConnection | null;
  sponsershipParty?: keyof typeof SponsershipParty | null;
  sponsershipDuration?: keyof typeof SponsershipDuration | null;
  minimumCost?: number | null;
  child?: IChild | null;
}

export const defaultValue: Readonly<IChildSponsorShip> = {};
