import { MongodbDocument } from '../interface.mongodb';
import { INotifyUser } from '../interface.user';

export interface INotifyNote extends MongodbDocument {
  owners: INotifyUser['_id'][];
  title: string;
  color: string;
  watchers: INotifyUser['_id'][];
  items: INotifyNoteItem[];
}

export interface INotifyNoteItem {
  type: EnumNotifyNoteItemType;
  value: unknown;
  config: Record<string, unknown>;
}

export enum EnumNotifyNoteItemType {
  Text = 'text',
  Todo = 'todo',
  Files = 'files',
  Link = 'link',
}
