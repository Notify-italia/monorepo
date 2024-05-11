import { FormControl } from '@angular/forms';
import { EnumNotifyAdvancedProfileItems } from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../../services/advanced-profile-items.service';
import { itemManifest } from '../item.manifest';

const manifest: INotifyAdvancedProfileManifest = {
  type: EnumNotifyAdvancedProfileItems.Photo,
  formConstructor: {
    ...itemManifest.formConstructor,
    imgSrc: new FormControl(''),
  },
};

AdvancedProfileItemsService.publishManifest(manifest);
