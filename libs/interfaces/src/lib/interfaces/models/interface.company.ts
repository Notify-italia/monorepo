import { MongodbDocument } from '../interface.mongodb';
import { INotifyLicense } from './interface.license';

export interface INotifyCompany extends MongodbDocument {
  license: INotifyLicense['_id'];
  email: string;
  password: string;
  allowedUsers: number;

  //Outside of the schema
  token?: string;
}
