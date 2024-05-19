import { Injectable } from '@angular/core';
import { INotifyAdvancedProfileItem } from '@notify/interfaces';
import { Subject } from 'rxjs';
import { IFrameModalNavbarStyle } from '../../modals';

export type ADVANCED_PROFILE_CLICK_EVENTS =
  | 'ITEM_CLICKED'
  | 'CREATE_IFRAME_MODAL'
  | 'CONTACT_CLICKED';

export interface CREATE_IFRAME_MODAL_CONFIG {
  url: string;
  title: string;
  navbarStyle: IFrameModalNavbarStyle;
}

export interface IAdvancedProfileItemClickedEvent<
  eventData = Record<string, unknown>
> {
  item: INotifyAdvancedProfileItem;
  eventName: ADVANCED_PROFILE_CLICK_EVENTS;
  eventData?: eventData;
}

@Injectable({ providedIn: 'root' })
export class AdvancedProfileItemOutputsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public itemClicked = new Subject<IAdvancedProfileItemClickedEvent<any>>();
  public showCompanyProfile = new Subject<void>();

  onItemClicked<T>(value: IAdvancedProfileItemClickedEvent<T>) {
    this.itemClicked.next(value);
  }

  onShowCompanyProfile() {
    this.showCompanyProfile.next();
  }
}
