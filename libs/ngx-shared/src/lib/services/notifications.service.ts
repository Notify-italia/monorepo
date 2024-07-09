import { Injectable } from '@angular/core';
import { FCM } from '@capacitor-community/fcm';
import { Capacitor } from '@capacitor/core';
import {
  PushNotifications,
  PushNotificationSchema,
} from '@capacitor/push-notifications';
import { INotifyNotification } from '@notify/interfaces';
import { from, Subject, switchMap } from 'rxjs';
import { HttpService } from './http.service';

@Injectable()
export class NotificationsService {
  public isNative = Capacitor.isNativePlatform();

  /*
   * FCM TOKEN MANAGEMENT OBSERVABLEs
   */
  private _firebaseRegistrationTokenSubject$ = new Subject<string>();
  public fcmTokenGenerated$ = this._firebaseRegistrationTokenSubject$.pipe(
    switchMap(() => from(FCM.subscribeTo({ topic: 'all' }))),
    switchMap(() => from(FCM.getToken()))
  );

  /*
   * NOTIFICATION ACTION PERFORMED OBSERVABLEs
   */
  private _notificationActionPerformSubject$ =
    new Subject<PushNotificationSchema>();
  public notificationActionPerform$ =
    this._notificationActionPerformSubject$.pipe(
      switchMap((notification) =>
        this.getNotification(notification.data.notification_id)
      )
    );

  constructor(private http: HttpService) {}

  public getUnreadNotificationsCount() {
    return this.http.get<{ result: number }>('/v1/notifications/count/unread');
  }

  public getNotifications(type: 'all' | 'unread' | 'read') {
    return this.http.get<INotifyNotification[]>('/v1/notifications', { type });
  }

  public getNotification(id: string) {
    return this.http.get<INotifyNotification>('/v1/notifications', { id });
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

  public async registerPushNotifications() {
    if (!this.isNative) {
      return;
    }

    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      return;
    }

    await PushNotifications.register();

    await PushNotifications.addListener('registration', (token) => {
      this._firebaseRegistrationTokenSubject$.next(token.value);
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Push notification received: ', notification);
      }
    );

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action) => {
        if (!action.notification.data.notification_id) {
          return;
        }

        this._notificationActionPerformSubject$.next(action.notification);
      }
    );
  }
}
