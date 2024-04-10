import { MongodbDocument } from '../interface.mongodb';
import { INotifyCompany } from './interface.company';

export interface INotifyLicense extends MongodbDocument {
  expirationDate: Date;
  enabled: boolean;
  publicKey: string;
  allowedAgents: number;
  //TODO gestire le features
  features: string[];
  boughtCards: number;
}

export type INotifyPopulatedLicense = INotifyLicense & {
  company: INotifyCompany<true>;
};
