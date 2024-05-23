import {
  EnumNotifyAdvancedProfileItems,
  INotifyAPPlaceItem,
} from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../../services/advanced-profile-items.service';
import { itemManifest } from '../item.manifest';
import { PlaceFormComponent } from './place.form.component';
import { PlacePlayerComponent } from './place.player.component';

const manifest: INotifyAdvancedProfileManifest<INotifyAPPlaceItem> = {
  type: EnumNotifyAdvancedProfileItems.Place,
  localizedName: 'Luogo',
  filledIcon: [
    'm11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  ],
  outlineIcon: [
    'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    'M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
  ],
  playerComponent: PlacePlayerComponent,
  formComponent: PlaceFormComponent,
  definitions: {
    ...itemManifest.definitions,
    address: '',
    civicNumber: '',
    city: '',
    companyName: '',
    showStreetName: true,
    zoom: 12,
  },
};

AdvancedProfileItemsService.publishManifest(manifest);
