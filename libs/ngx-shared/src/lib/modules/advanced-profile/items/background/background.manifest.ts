import {
  EnumNotifyAdvancedProfileItems,
  NotifyAdvancedProfileItem,
} from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../../services/advanced-profile-items.service';
import { itemManifest } from '../item.manifest';
import { BackgroundFormComponent } from './background.form.component';
import { BackgroundPlayerComponent } from './background.player.component';

const manifest: INotifyAdvancedProfileManifest<NotifyAdvancedProfileItem> = {
  type: EnumNotifyAdvancedProfileItems.Unknown,
  localizedName: 'background',
  isSystemItem: true,
  filledIcon: [],
  outlineIcon: [],
  formComponent: BackgroundFormComponent,
  playerComponent: BackgroundPlayerComponent,
  definitions: {
    ...itemManifest.definitions,
  },
};

AdvancedProfileItemsService.publishManifest(manifest);
