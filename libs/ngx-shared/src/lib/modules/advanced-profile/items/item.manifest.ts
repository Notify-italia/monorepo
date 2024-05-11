import { FormControl } from '@angular/forms';
import { EnumNotifyAdvancedProfileItems } from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../services/advanced-profile-items.service';

export const itemManifest: INotifyAdvancedProfileManifest = {
  type: EnumNotifyAdvancedProfileItems.Unknown,
  localizedName: 'Sconosciuto',
  filledIcon: [],
  formConstructor: {
    type: new FormControl(EnumNotifyAdvancedProfileItems.Unknown),
    clickEvent: new FormControl(''),
    clickEventData: new FormControl(''),
    visible: new FormControl(true),
    title: new FormControl(''),
    showTitle: new FormControl(true),
    _id: new FormControl(''),
  },
};

AdvancedProfileItemsService.publishManifest(itemManifest);
