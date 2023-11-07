import { INotifyAgent } from './models/interface.agent';
import { INotifyCompany } from './models/interface.company';

export interface INotifyAuth {
  email: string;
  password: string;
}

export interface INotifyAcount {
  [EnumNotifyAccountType.agent]: INotifyAgent;
  [EnumNotifyAccountType.company]: INotifyCompany;
}

export enum EnumNotifyAccountType {
  agent = 'agent',
  company = 'company',
}
