import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  EnumNotifyAPButtonStyles,
  EnumNotifyAPDirections,
  EnumNotifyAdvancedProfileItems,
} from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../../services/advanced-profile-items.service';
import { itemManifest } from '../item.manifest';

const manifest: INotifyAdvancedProfileManifest = {
  type: EnumNotifyAdvancedProfileItems.Links,
  formConstructor: {
    ...itemManifest.formConstructor,
    style: new FormControl(EnumNotifyAPButtonStyles.Text),
    direction: new FormControl(EnumNotifyAPDirections.Horizontal),
    items: new FormArray([
      new FormGroup({
        caption: new FormControl('Nuovo Link'),
        url: new FormControl(''),
        icon: new FormControl(''),
      }),
    ]),
  },
};

AdvancedProfileItemsService.publishManifest(manifest);
