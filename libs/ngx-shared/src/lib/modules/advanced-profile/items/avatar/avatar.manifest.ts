import { FormControl } from '@angular/forms';
import {
  EnumNotifyAPCorners,
  EnumNotifyAPDirections,
  EnumNotifyAdvancedProfileItems,
  daisyUIAvatarMaks,
} from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../../services/advanced-profile-items.service';
import { itemManifest } from '../item.manifest';

const manifest: INotifyAdvancedProfileManifest = {
  type: EnumNotifyAdvancedProfileItems.Avatar,
  formConstructor: {
    ...itemManifest.formConstructor,
    direction: new FormControl(EnumNotifyAPDirections.Vertical),
    label: new FormControl(''),
    sublabel: new FormControl(''),
    description: new FormControl('Nessuna Descrizione'),
    imgSrc: new FormControl(''),
    imgMask: new FormControl(daisyUIAvatarMaks[0]),
    ownerImageCorner: new FormControl(EnumNotifyAPCorners.BottomRight),
    ownerImagePath: new FormControl(''),
  },
};

AdvancedProfileItemsService.publishManifest(manifest);
