import { Injectable } from '@angular/core';
import { INotifyNotification } from '@notify/interfaces';
import { BaseFactory } from '../../../constructors/base.factory';
import { InspectNotificationComponent } from './inspect-notification.component';

@Injectable()
export class InspectNotificationFactory extends BaseFactory {
  public create(config: { notification: INotifyNotification }) {
    return this._createComponent(InspectNotificationComponent, config);
  }
}
