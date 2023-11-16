import { INotifyCompany } from './interface.company';
import { INotifyProfile } from './interface.profile';

export interface INotifyAgent {
  _id: string;
  createdAt: string; //*statico\
  updatedAt: string; //*statico\
  enabled: boolean;
  email: string;
  password: string;
  profile: INotifyProfile['_id'];
  company: INotifyCompany['_id'];

  //Outside of the schema
  token?: string;
}
