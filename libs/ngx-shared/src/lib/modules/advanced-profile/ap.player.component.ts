import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { FormsService } from '../../services';
import { BackgroundPlayerComponent } from './items/background/background.player.component';
import { AdvancedProfileItemsService } from './services/advanced-profile-items.service';

@Component({
  selector: 'notify-ap-player',
  standalone: true,
  imports: [CommonModule, BackgroundPlayerComponent],
  providers: [AdvancedProfileItemsService, FormsService],
  templateUrl: './ap.player.component.html',
})
export class AdvancedProfilePlayerComponent {
  private _apItems = inject(AdvancedProfileItemsService);

  @Input() profile!: INotifyProfile;
  @Input() contained = false;

  public get background() {
    return this._apItems.getSystemManifests('background');
  }

  public get advancedProfile() {
    return this.profile.advancedProfile;
  }

  public get advancedProfileItems() {
    return this.advancedProfile?.items.map((i) => ({
      data: i,
      manifest: this._apItems.getManifest(i.type),
    }));
  }
}
