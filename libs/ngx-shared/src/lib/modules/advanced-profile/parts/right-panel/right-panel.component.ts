import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { INotifyProfile } from '@notify/interfaces';
import { controlsFromObject } from '../../../../services';
import { SaveIndicatorComponent } from '../../../../standalones';
import { INotifyShareItemConfig, ShareItemComponent } from '../../../profile';
import { PartSettingsComponent } from '../../components/part-settings/part-settings.component';

@Component({
  selector: 'notify-right-panel',
  standalone: true,
  imports: [
    CommonModule,
    ShareItemComponent,
    SaveIndicatorComponent,
    PartSettingsComponent,
  ],
  templateUrl: './right-panel.component.html',
  styleUrls: [
    './right-panel.component.scss',
    '../../advanced-profile.styles.scss',
  ],
})
export class RightPanelComponent {
  @Input({ required: true }) loading = false;
  @Input({ required: true }) profile!: INotifyProfile;
  @Input({ required: true }) environment!: Record<string, unknown>;
  @Input({ required: true }) form?: FormGroup<
    controlsFromObject<INotifyProfile['advancedProfile']>
  >;
  @Input({ required: true }) selectedHierarchyItem = 'background';

  @Output() forceSave = new EventEmitter<void>();
  @Output() closePanel = new EventEmitter<void>();
  @Output() removeItem = new EventEmitter<string>();

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
      baseUrl: this.environment['profilesUrl'] as string,
      isInModal: false,
      id: this.profile?._id,
    };
  }
}
