import {
  EnumNotifyAPContainerStyles,
  EnumNotifyAdvancedProfileItems,
  INotifyAPLabelItem,
} from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../../services/advanced-profile-items.service';
import { itemManifest } from '../item.manifest';
import { LabelFormComponent } from './label.form.component';
import { LabelPlayerComponent } from './label.player.component';

const manifest: INotifyAdvancedProfileManifest<INotifyAPLabelItem> = {
  type: EnumNotifyAdvancedProfileItems.Label,
  formComponent: LabelFormComponent,
  playerComponent: LabelPlayerComponent,
  localizedName: 'Testo',
  formOptions: {
    hideTextSettings: false,
  },
  filledIcon: [
    'M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z',
  ],
  outlineIcon: ['M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12'],
  definitions: {
    ...itemManifest.definitions,
    content: '',
    style: EnumNotifyAPContainerStyles.Text,
  },
};

AdvancedProfileItemsService.publishManifest(manifest);
