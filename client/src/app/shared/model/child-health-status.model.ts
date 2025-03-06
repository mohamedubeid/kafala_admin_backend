import { IChild } from 'app/shared/model/child.model';
import { HealthStatus } from 'app/shared/model/enumerations/health-status.model';
import { DisabilityTypes } from 'app/shared/model/enumerations/disability-types.model';
import { MentalIllnessTypes } from 'app/shared/model/enumerations/mental-illness-types.model';
import { SychologicalHealthTypes } from 'app/shared/model/enumerations/sychological-health-types.model';

export interface IChildHealthStatus {
  id?: number;
  healthStatus?: keyof typeof HealthStatus | null;
  chronicDisease?: boolean | null;
  hasDisability?: boolean | null;
  disabilityType?: keyof typeof DisabilityTypes | null;
  disabilityImage?: string | null;
  hasMentalIllness?: boolean | null;
  mentalIllnessType?: keyof typeof MentalIllnessTypes | null;
  mentalIllnessImage?: string | null;
  sychologicalHealth?: boolean | null;
  sychologicalHealthType?: keyof typeof SychologicalHealthTypes | null;
  sychologicalHealthImage?: string | null;
  healthReport?: string | null;
  child?: IChild | null;
}

export const defaultValue: Readonly<IChildHealthStatus> = {
  chronicDisease: false,
  hasDisability: false,
  hasMentalIllness: false,
  sychologicalHealth: false,
};
