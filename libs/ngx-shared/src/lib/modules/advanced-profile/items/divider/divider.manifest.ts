import {
  EnumNotifyAPBorderStyles,
  EnumNotifyAdvancedProfileItems,
  INotifyAPDividerItem,
} from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../../services/advanced-profile-items.service';
import { itemManifest } from '../item.manifest';
import { DividerFormComponent } from './divider.form.component';
import { DividerPlayerComponent } from './divider.player.component';

const manifest: INotifyAdvancedProfileManifest<INotifyAPDividerItem> = {
  type: EnumNotifyAdvancedProfileItems.Divider,
  localizedName: 'Divisore',
  filledIcon: [
    'M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z',
  ],
  outlineIcon: ['M5 12h14'],
  formOptions: {
    hideTextSettings: true,
    hideTitle: true,
  },
  playerComponent: DividerPlayerComponent,
  formComponent: DividerFormComponent,
  definitions: {
    ...itemManifest.definitions,
    style: EnumNotifyAPBorderStyles.Solid,
    height: 1,
    color: '#52565D',
  },
};

AdvancedProfileItemsService.publishManifest(manifest);
