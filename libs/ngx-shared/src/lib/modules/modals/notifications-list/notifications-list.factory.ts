import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../constructors/base.factory';
import { NotificationsListComponent } from './notifications-list.component';

@Injectable()
export class NotificationsListFactory extends BaseFactory {
  public create() {
    return this._createComponent(NotificationsListComponent);
  }
}
