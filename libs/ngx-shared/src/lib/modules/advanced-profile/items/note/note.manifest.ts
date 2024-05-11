import { FormControl } from '@angular/forms';
import { EnumNotifyAdvancedProfileItems } from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../../services/advanced-profile-items.service';
import { itemManifest } from '../item.manifest';

const manifest: INotifyAdvancedProfileManifest = {
  type: EnumNotifyAdvancedProfileItems.Note,
  formConstructor: {
    ...itemManifest.formConstructor,
    note: new FormControl(''),
    showNoteTitle: new FormControl(true),
  },
};

AdvancedProfileItemsService.publishManifest(manifest);
