import { MongodbDocument } from '../interface.mongodb';
import { INotifyUser } from '../interface.user';

export interface INotifyFeedback extends MongodbDocument {
  owner: INotifyUser['_id'];
  rating: number;
  comment: string | null;
}
