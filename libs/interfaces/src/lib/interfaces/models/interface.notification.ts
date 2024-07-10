import { UnknownType } from '../../types.utils';
import { MongodbDocument } from '../interface.mongodb';
import { INotifyUser } from '../interface.user';

/**
 * {{origin}}:{{action}}:{{choice}}
 */
export enum EnumNotifyNotificationActionEvents {
  ContactFormLeadAccept = 'contact-form:lead:accept',
  ContactFormLeadReject = 'contact-form:lead:reject',
  LeadsRouteDetail = 'leads:route:detail',
  NotificationEventIgnore = 'notifications:event:ignore',
}

export enum EnumNotificationTypes {
  Info = 'info',
  ActionRequired = 'action-required',
  Warning = 'warning',
  Error = 'error',
}

export interface INotifyNotification extends MongodbDocument {
  title: string;
  subtitle: string;
  /**
   * HTML content
   */
  description: string;
  read: boolean;
  notificationType: EnumNotificationTypes;
  owner: INotifyUser['_id'];
  selectedAction: INotifyNotificationAction['id'] | null;
  actions: INotifyNotificationAction[];
}

export interface INotifyNotificationAction {
  id: string;
  data: UnknownType;
  title: string;
  eventName: EnumNotifyNotificationActionEvents;
}
