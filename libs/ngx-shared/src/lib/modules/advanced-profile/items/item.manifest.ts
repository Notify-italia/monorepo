import { EnumNotifyAdvancedProfileItems } from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../services/advanced-profile-items.service';

export const itemManifest: INotifyAdvancedProfileManifest = {
  type: EnumNotifyAdvancedProfileItems.Unknown,
  localizedName: 'Sconosciuto',
  filledIcon: [],
  definitions: {
    type: EnumNotifyAdvancedProfileItems.Unknown,
    clickEvent: '',
    clickEventData: '',
    visible: true,
    title: '',
    showTitle: true,
    _id: '',
  },
};

AdvancedProfileItemsService.publishManifest(itemManifest);
