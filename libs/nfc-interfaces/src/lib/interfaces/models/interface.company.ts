import { INotifyProfile } from './interface.profile';

export interface INotifyCompany {
  _id: string;
  createdAt: string;
  updatedAt: string;
  license: string; //INotifyLicense['_id'];
  email: string;
  password: string;
  profile: INotifyProfile['_id'];

  //Outside of the schema
  token?: string;
}
