import { MongodbDocument } from '../interface.mongodb';
import { INotifyCompany } from './interface.company';
import { INotifyProfile } from './interface.profile';
import { INotifyUserStats } from './interface.stat';

export interface INotifyAgent extends MongodbDocument {
  enabled: boolean;
  email: string;
  password?: string;
  owner: INotifyCompany['_id'];
  statsTotals: INotifyUserStats;
  savedRedirects: string[];
  //Outside of the schema
  token?: string;
  profile?: INotifyProfile;
}

export interface INotifyPartialAgent extends Partial<INotifyAgent> {
  role?: string;
}
