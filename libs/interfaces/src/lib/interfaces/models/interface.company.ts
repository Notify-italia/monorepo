import { MongodbDocument } from '../interface.mongodb';
import { INotifyLicense } from './interface.license';
import { EnumNotifyStatType } from './interface.stat';

export interface INotifyCompany<populated extends true | false = false>
  extends MongodbDocument {
  license: populated extends true ? INotifyLicense : INotifyLicense['_id'];
  email: string;
  password?: string;
  createdRoles: string[];
  statsTotals: { [key in EnumNotifyStatType]: number };

  //Outside of the schema
  token?: string;
}
