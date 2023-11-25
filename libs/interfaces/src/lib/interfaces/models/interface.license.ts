import { MongodbDocument } from '../interface.mongodb';

export interface INotifyLicense extends MongodbDocument {
  expirationDate: Date;
  enabled: boolean;
  publicKey: string;
  allowedAgents: number;
  //TODO gestire le features
  features: string[];
}
