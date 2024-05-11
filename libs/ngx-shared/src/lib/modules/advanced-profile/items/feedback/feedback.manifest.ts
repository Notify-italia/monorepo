import { FormControl } from '@angular/forms';
import { EnumNotifyAdvancedProfileItems } from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../../services/advanced-profile-items.service';
import { itemManifest } from '../item.manifest';

const manifest: INotifyAdvancedProfileManifest = {
  type: EnumNotifyAdvancedProfileItems.Feedback,
  formConstructor: {
    ...itemManifest.formConstructor,
    caption: new FormControl(''),
    icon: new FormControl(''),
    url: new FormControl(''),
  },
};

AdvancedProfileItemsService.publishManifest(manifest);
