import { IUser } from 'app/shared/model/user.model';
import { Gender } from 'app/shared/model/enumerations/gender.model';

export interface IChild {
  id?: number;
  firstName?: string | null;
  imageUrl?: string | null;
  nationalId?: string | null;
  nationalImage?: string | null;
  birthCertificate?: string | null;
  email?: string | null;
  fatherName?: string | null;
  fatherPhone?: string | null;
  brotherCode?: string | null;
  motherName?: string | null;
  familyName?: string | null;
  gender?: keyof typeof Gender | null;
  age?: number | null;
  vedio?: string | null;
  description?: string | null;
  address?: string | null;
  score?: number | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IChild> = {};
