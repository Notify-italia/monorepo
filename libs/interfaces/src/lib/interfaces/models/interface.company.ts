import { MongodbDocument } from '../interface.mongodb';
import { INotifyLicense } from './interface.license';
import { INotifyProfile } from './interface.profile';
import { INotifyUserStats } from './interface.stat';

export interface INotifyCompany<populatedLicense extends true | false = false>
  extends MongodbDocument {
  license: populatedLicense extends true
    ? INotifyLicense
    : INotifyLicense['_id'];
  email: string;
  password?: string;
  createdRoles: string[];
  savedRedirects: string[];
  statsTotals: INotifyUserStats;
  profile?: INotifyProfile;

  //Outside of the schema
  token?: string;
}
