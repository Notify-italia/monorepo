import { INotifyLicense } from './interface.license';

export interface INotifyCompany {
  _id: string;
  createdAt: string;
  updatedAt: string;
  license: INotifyLicense['_id'];
  email: string;
  password: string;
  allowedUsers: number;

  //Outside of the schema
  token?: string;
}
