import { MongodbDocument } from '../interface.mongodb';
import { INotifyUser } from '../interface.user';

export interface INotifyNote extends MongodbDocument {
  owner: INotifyUser['_id'];
  title: string;
  content: string;
  customerName: string;
}
