import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { EnumNotifyAdvancedProfileItems } from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../../services/advanced-profile-items.service';
import { itemManifest } from '../item.manifest';

const manifest: INotifyAdvancedProfileManifest = {
  type: EnumNotifyAdvancedProfileItems.Contacts,
  formConstructor: {
    ...itemManifest.formConstructor,
    items: new FormArray([
      new FormGroup({
        caption: new FormControl('Nuovo Contatto'),
        url: new FormControl(''),
        icon: new FormControl(''),
      }),
    ]),
  },
};

AdvancedProfileItemsService.publishManifest(manifest);
