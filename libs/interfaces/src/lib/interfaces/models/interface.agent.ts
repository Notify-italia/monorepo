import { MongodbDocument } from '../interface.mongodb';
import { INotifyCompany } from './interface.company';
import { INotifyProfile } from './interface.profile';

export interface INotifyAgent extends MongodbDocument {
  enabled: boolean;
  email: string;
  password?: string;
  owner: INotifyCompany['_id'];

  //Outside of the schema
  token?: string;
  profile?: INotifyProfile;
}
