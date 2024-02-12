import { MongodbDocument } from '../interface.mongodb';
import { INotifyLicense } from './interface.license';
import { INotifyUserStats } from './interface.stat';

export interface INotifyCompany<populated extends true | false = false>
  extends MongodbDocument {
  license: populated extends true ? INotifyLicense : INotifyLicense['_id'];
  email: string;
  password?: string;
  createdRoles: string[];
  savedRedirects: string[];
  statsTotals: INotifyUserStats;

  //Outside of the schema
  token?: string;
}
