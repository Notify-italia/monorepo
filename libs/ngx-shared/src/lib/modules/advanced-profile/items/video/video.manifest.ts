import {
  EnumNotifyAdvancedProfileItems,
  INotifyAPVideoItem,
} from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../../services/advanced-profile-items.service';
import { itemManifest } from '../item.manifest';
import { VideoFormComponent } from './video.form.component';
import { VideoPlayerComponent } from './video.player.component';

const manifest: INotifyAdvancedProfileManifest<INotifyAPVideoItem> = {
  type: EnumNotifyAdvancedProfileItems.Video,
  localizedName: 'Video YouTube',
  filledIcon: [
    'M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z',
  ],
  outlineIcon: [
    'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z',
  ],
  formOptions: {
    hideTextSettings: true,
  },
  playerComponent: VideoPlayerComponent,
  formComponent: VideoFormComponent,
  definitions: {
    ...itemManifest.definitions,
    autoplay: true,
    muted: true,
    loop: true,
    source: '',
    height: 250,
    controls: false,
  },
};

AdvancedProfileItemsService.publishManifest(manifest);
