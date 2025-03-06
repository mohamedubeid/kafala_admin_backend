export interface ISetting {
  id?: number;
  key?: string | null;
  value?: string | null;
}

export const defaultValue: Readonly<ISetting> = {};
