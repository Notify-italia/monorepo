import { INotifyCompany } from './interface.company';

export interface INotifyAgent {
  _id: string;
  createdAt: string; //*statico\
  updatedAt: string; //*statico\
  enabled: boolean;
  email: string;
  password: string;
  owner: INotifyCompany['_id'];

  //Outside of the schema
  token?: string;
}
