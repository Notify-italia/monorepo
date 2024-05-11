import { FormControl } from '@angular/forms';
import { EnumNotifyAdvancedProfileItems } from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../../services/advanced-profile-items.service';
import { itemManifest } from '../item.manifest';

const manifest: INotifyAdvancedProfileManifest = {
  type: EnumNotifyAdvancedProfileItems.Iframe,
  formConstructor: {
    ...itemManifest.formConstructor,
    url: new FormControl(''),
  },
};

AdvancedProfileItemsService.publishManifest(manifest);
