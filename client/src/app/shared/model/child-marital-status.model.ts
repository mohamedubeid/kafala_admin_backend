import dayjs from 'dayjs';
import { IChild } from 'app/shared/model/child.model';
import { OrphanClassification } from 'app/shared/model/enumerations/orphan-classification.model';

export interface IChildMaritalStatus {
  id?: number;
  orphanClassification?: keyof typeof OrphanClassification | null;
  fatherDateOfDeath?: dayjs.Dayjs | null;
  guardianName?: string | null;
  guardianNationalID?: string | null;
  guardianRelationship?: string | null;
  guardianDocument?: string | null;
  dateOfBeathImage?: string | null;
  numOfSibiling?: number | null;
  lostHousing?: boolean | null;
  lostLimbs?: boolean | null;
  lostSight?: boolean | null;
  losthearorspeak?: boolean | null;
  hasChronicDiseases?: boolean | null;
  child?: IChild | null;
}

export const defaultValue: Readonly<IChildMaritalStatus> = {
  lostHousing: false,
  lostLimbs: false,
  lostSight: false,
  losthearorspeak: false,
  hasChronicDiseases: false,
};
