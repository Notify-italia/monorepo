import { Injectable } from '@angular/core';
import { INotifyNotification } from '@notify/interfaces';
import { HttpService } from './http.service';

@Injectable()
export class NotificationsService {
  constructor(private http: HttpService) {}

  public getUnreadNotificationsCount() {
    return this.http.get<{ result: number }>('/v1/notifications/count/unread');
  }

  public getNotifications(type: 'all' | 'unread' | 'read') {
    return this.http.get<INotifyNotification[]>('/v1/notifications', { type });
  }

  public patchNotification(
    id: string,
    notification: Partial<INotifyNotification>
  ) {
    return this.http.patch<
      { notification: Partial<INotifyNotification> },
      INotifyNotification
    >('/v1/notifications', { notification }, { id });
  }
}
