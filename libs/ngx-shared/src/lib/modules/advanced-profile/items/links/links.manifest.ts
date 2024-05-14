import {
  EnumNotifyAPButtonStyles,
  EnumNotifyAPDirections,
  EnumNotifyAdvancedProfileItems,
  INotifyAPLinksItem,
} from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../../services/advanced-profile-items.service';
import { itemManifest } from '../item.manifest';
import { LinksFormComponent } from './links.form.component';

const manifest: INotifyAdvancedProfileManifest<INotifyAPLinksItem> = {
  type: EnumNotifyAdvancedProfileItems.Links,
  localizedName: 'Links',
  filledIcon: [
    'M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z',
  ],
  outlineIcon: [
    'M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244',
  ],
  formComponent: LinksFormComponent,
  definitions: {
    ...itemManifest.definitions,
    style: EnumNotifyAPButtonStyles.Text,
    direction: EnumNotifyAPDirections.Horizontal,
    items: [
      {
        icon: '',
        url: '',
        caption: 'Nuovo Link',
        visible: true,
      },
    ],
  },
};

AdvancedProfileItemsService.publishManifest(manifest);
