import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { INotifyProfile, NotifyPopulatedNote } from '@notify/interfaces';
import { ModalBaseComponent } from '../../../../constructors/modal.base.component';
import { ProfileService } from '../../../../services';
import { ProfileViewComponent } from '../profile-view/profile-view.component';
import {
  INotifyShareItemConfig,
  ShareItemComponent,
} from '../share-profile/share-item.component';

@Component({
  selector: 'notify-fullscreen-mockup',
  standalone: true,
  imports: [CommonModule, ProfileViewComponent, ShareItemComponent],
  //* per qualche ragione, sul sito vetrina se non si fa il provide di profile service da un errore all'apertura dei profili dei partners
  providers: [ProfileService],
  templateUrl: './fullscreen-mockup.component.html',
  styleUrls: ['./fullscreen-mockup.component.scss', '../profile.styles.scss'],
})
export class FullscreenMockupComponent extends ModalBaseComponent {
  @Input({ required: true }) profile!: INotifyProfile & {
    note?: NotifyPopulatedNote;
  };
  @Input({ required: true }) baseUrl?: string;
  @Input() hideShare = false;

  public get shareConfig(): INotifyShareItemConfig {
    const companyNfcItem = this.profile.company
      ? [
          {
            value: this.profile.company._id,
            label: 'Profilo Aziendale',
          },
        ]
      : [];

    return {
      type: 'profile',
      id: this.profile.profileIdentifier || this.profile._id,
      baseUrl: this.baseUrl || '',
      isInModal: true,
      qrcode: {
        title: 'Condividi il profilo',
        fileName: this.profile.name || 'Profilo',
      },
      nfc: {
        items: [
          {
            value: this.profile._id,
            label: 'Questo Profilo',
          },
          ...companyNfcItem,
        ],
      },
    };
  }
}
