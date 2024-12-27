import { EnumNotifyAdvancedProfileItems } from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../services/advanced-profile-items.service';

export const itemManifest: INotifyAdvancedProfileManifest = {
  type: EnumNotifyAdvancedProfileItems.Unknown,
  localizedName: 'Sconosciuto',
  filledIcon: [],
  outlineIcon: [
    'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z',
  ],
  definitions: {
    type: EnumNotifyAdvancedProfileItems.Unknown,
    visible: true,
    title: '',
    showTitle: true,
    _id: '',
    textConfig: {
      enabled: false,
      font: '',
      fontSize: 0,
      textColor: '',
    },
  },
};

AdvancedProfileItemsService.publishManifest(itemManifest);
