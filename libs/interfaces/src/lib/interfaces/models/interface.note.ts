import { MongodbDocument } from '../interface.mongodb';
import { INotifyUser } from '../interface.user';

export type INotifyNoteItemValue =
  | INotifyNoteItemText
  | INotifyNoteItemTodo
  | INotifyNoteItemFiles
  | INotifyNoteItemLink
  | INotifyNoteHeader;

export interface INotifyNote extends MongodbDocument {
  owners: INotifyUser['_id'][];
  title: string;
  color: string;
  watchers: INotifyUser['_id'][];
  items: INotifyNoteItem[];
}

export interface INotifyNoteItem {
  type: EnumNotifyNoteItemType;
  value: INotifyNoteItemValue | null;
}

export enum EnumNotifyNoteItemType {
  Text = 'text',
  Todo = 'todo',
  Files = 'files',
  Link = 'link',
}

export interface INotifyNoteHeader {
  title: string;
  color: string;
}

export interface INotifyNoteItemTodo {
  title: string;
  done: boolean;
}

export interface INotifyNoteItemFiles {
  files: INotifyNoteItemFile[];
}

export interface INotifyNoteItemFile {
  name: string;
  url: string;
}

export interface INotifyNoteItemLink {
  title: string;
  url: string;
}

export interface INotifyNoteItemText {
  content: string;
}
