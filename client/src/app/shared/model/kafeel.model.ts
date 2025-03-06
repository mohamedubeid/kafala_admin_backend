import { IUser } from 'app/shared/model/user.model';

export interface IKafeel {
  id?: number;
  user?: IUser | null;
}

export const defaultValue: Readonly<IKafeel> = {};
