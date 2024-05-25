import {
  EnumNotifyAdvancedProfileItems,
  NotifyAdvancedProfileItem,
} from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../../services/advanced-profile-items.service';
import { itemManifest } from '../item.manifest';
import { PageFormComponent } from './page.form.component';
import { PagePlayerComponent } from './page.player.component';

const manifest: INotifyAdvancedProfileManifest<NotifyAdvancedProfileItem> = {
  type: EnumNotifyAdvancedProfileItems.Unknown,
  localizedName: 'background',
  isSystemItem: true,
  filledIcon: [],
  outlineIcon: [],
  formComponent: PageFormComponent,
  playerComponent: PagePlayerComponent,
  definitions: {
    ...itemManifest.definitions,
  },
};

AdvancedProfileItemsService.publishManifest(manifest);
