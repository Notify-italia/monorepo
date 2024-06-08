import { Injectable } from '@angular/core';
import {
  INotifyAdvancedProfileItem,
  INotifyProfile,
  NotifyAdvancedProfileItem,
} from '@notify/interfaces';
import { Subject } from 'rxjs';
import { IFrameModalNavbarStyle } from '../../modals';

export type ADVANCED_PROFILE_CLICK_EVENTS =
  | 'ITEM_CLICKED'
  | 'CREATE_IFRAME_MODAL'
  | 'CONTACT_CLICKED'
  | 'SHOW_COMPANY_PROFILE'
  | 'SHOW_FEEDBACK_FORM'
  | 'LINK_CLICKED';

export interface CREATE_IFRAME_MODAL_CONFIG {
  url: string;
  title: string;
  navbarStyle: IFrameModalNavbarStyle;
}

export interface IAdvancedProfileItemEvent<
  eventData = Record<string, unknown>
> {
  item: INotifyAdvancedProfileItem;
  profile: INotifyProfile;
  eventName: ADVANCED_PROFILE_CLICK_EVENTS;
  eventData?: eventData;
}

@Injectable({ providedIn: 'root' })
export class AdvancedProfileItemOutputsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public itemClicked = new Subject<IAdvancedProfileItemEvent<any>>();
  public showCompanyProfile = new Subject<void>();
  public hierarchyChanged = new Subject<NotifyAdvancedProfileItem[]>();

  triggerItemEvent<T>(value: IAdvancedProfileItemEvent<T>) {
    this.itemClicked.next(value);
  }

  onHierarchyChanged(items: NotifyAdvancedProfileItem[]) {
    this.hierarchyChanged.next(items);
  }

  onShowCompanyProfile() {
    this.showCompanyProfile.next();
  }
}
