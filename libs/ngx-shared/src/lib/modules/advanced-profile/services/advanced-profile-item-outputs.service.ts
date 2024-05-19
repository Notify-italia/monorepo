import { Injectable } from '@angular/core';
import { INotifyAdvancedProfileItem } from '@notify/interfaces';
import { Subject } from 'rxjs';

export interface IAdvancedProfileItemClickedEvent {
  item: INotifyAdvancedProfileItem;
  eventName: string;
  clickEventData?: INotifyAdvancedProfileItem['clickEventData'];
}

@Injectable({ providedIn: 'root' })
export class AdvancedProfileItemOutputsService {
  public itemClicked = new Subject<IAdvancedProfileItemClickedEvent>();
  public showCompanyProfile = new Subject<void>();

  onItemClicked(value: IAdvancedProfileItemClickedEvent) {
    console.log('onItemClicked', value);
    this.itemClicked.next(value);
  }

  onShowCompanyProfile() {
    this.showCompanyProfile.next();
  }
}
