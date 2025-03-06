import dayjs from 'dayjs';
import { IChild } from 'app/shared/model/child.model';
import { IKafeel } from 'app/shared/model/kafeel.model';
import { SponsershipDuration } from 'app/shared/model/enumerations/sponsership-duration.model';
import { RelChildKafeelStatus } from 'app/shared/model/enumerations/rel-child-kafeel-status.model';

export interface IRelChildKafeel {
  id?: number;
  duration?: keyof typeof SponsershipDuration | null;
  cost?: number | null;
  expirationDate?: dayjs.Dayjs | null;
  startDate?: dayjs.Dayjs | null;
  status?: keyof typeof RelChildKafeelStatus | null;
  child?: IChild | null;
  kafeel?: IKafeel | null;
}

export const defaultValue: Readonly<IRelChildKafeel> = {};
