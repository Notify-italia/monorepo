import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { SaveIndicatorComponent } from '../../../../standalones';
import { INotifyShareItemConfig, ShareItemComponent } from '../../../profile';

@Component({
  selector: 'notify-right-panel',
  standalone: true,
  imports: [CommonModule, ShareItemComponent, SaveIndicatorComponent],
  templateUrl: './right-panel.component.html',
  styleUrls: [
    './right-panel.component.scss',
    '../../advanced-profile.styles.scss',
  ],
})
export class RightPanelComponent {
  @Input() loading = false;
  @Input() profile!: INotifyProfile;
  @Input() baseUrl = '';

  @Output() forceSave = new EventEmitter<void>();

  public TEMP_today = new Date();

  public get shareConfig(): INotifyShareItemConfig {
    return {
      type: 'profile',
      qrcode: {
        fileName: `profile.png`,
      },
      nfc: {
        items: [
          {
            value: this.profile?._id,
            label: 'Conferma',
          },
        ],
      },
      baseUrl: this.baseUrl,
      isInModal: false,
      id: this.profile?._id,
    };
  }
}
