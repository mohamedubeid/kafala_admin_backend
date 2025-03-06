import { IChild } from 'app/shared/model/child.model';
import { LastLevelOfEducation } from 'app/shared/model/enumerations/last-level-of-education.model';

export interface IChildEducationStatus {
  id?: number;
  lastLevelOfEducation?: keyof typeof LastLevelOfEducation | null;
  hoppy?: string | null;
  lastLevelOfEducationImage?: string | null;
  child?: IChild | null;
}

export const defaultValue: Readonly<IChildEducationStatus> = {};
