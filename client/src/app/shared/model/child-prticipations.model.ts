import { IChild } from 'app/shared/model/child.model';
import { ParticipationTypes } from 'app/shared/model/enumerations/participation-types.model';

export interface IChildPrticipations {
  id?: number;
  participationType?: keyof typeof ParticipationTypes | null;
  image?: string | null;
  desceription?: string | null;
  child?: IChild | null;
}

export const defaultValue: Readonly<IChildPrticipations> = {};
