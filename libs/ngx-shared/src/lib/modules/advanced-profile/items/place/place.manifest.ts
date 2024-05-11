import { FormControl } from '@angular/forms';
import { EnumNotifyAdvancedProfileItems } from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../../services/advanced-profile-items.service';
import { itemManifest } from '../item.manifest';

const manifest: INotifyAdvancedProfileManifest = {
  type: EnumNotifyAdvancedProfileItems.Place,
  formConstructor: {
    ...itemManifest.formConstructor,
    address: new FormControl(''),
    city: new FormControl(''),
    showStreetName: new FormControl(true),
  },
};

AdvancedProfileItemsService.publishManifest(manifest);
