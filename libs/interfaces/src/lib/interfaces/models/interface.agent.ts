import { MongodbDocument } from '../interface.mongodb';
import { INotifyUserStats } from '../interface.user';
import { INotifyCompany } from './interface.company';
import { INotifyProfile } from './interface.profile';

export interface INotifyAgent extends MongodbDocument {
  enabled: boolean;
  email: string;
  password?: string;
  owner: INotifyCompany['_id'];
  statsTotals: INotifyUserStats;

  //Outside of the schema
  token?: string;
  profile?: INotifyProfile;
}

export interface INotifyPartialAgent extends Partial<INotifyAgent> {
  role: string;
}
