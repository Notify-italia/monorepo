import { MongodbDocument } from '../interface.mongodb';
import { INotifyUser } from '../interface.user';

export interface INotifyNote extends MongodbDocument {
  owners: INotifyUser['_id'][];
  title: string;
  content: string;
  color: string;
  watchers: INotifyUser['_id'][];
  files: {
    name: string;
    content: string;
    type: string;
  }[];
}
