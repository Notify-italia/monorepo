import { CommonModule } from '@angular/common';
import { Component, Input, Output, inject } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { INotifyAdvancedProfileItem, INotifyProfile } from '@notify/interfaces';
import { Subject } from 'rxjs';
import { FormsService } from '../../services';
import { PagePlayerComponent } from './items/page/page.player.component';
import { AdvancedProfileItemOutputsService } from './services/advanced-profile-item-outputs.service';
import { AdvancedProfileItemsService } from './services/advanced-profile-items.service';

@Component({
  selector: 'notify-ap-player',
  standalone: true,
  imports: [CommonModule, PagePlayerComponent],
  providers: [AdvancedProfileItemsService, FormsService],
  templateUrl: './ap.player.component.html',
})
export class AdvancedProfilePlayerComponent {
  private _apItems = inject(AdvancedProfileItemsService);
  public apItemOutputs = inject(AdvancedProfileItemOutputsService);

  @Input() profile!: INotifyProfile;
  @Input() contained = false;
  @Input() isRunningOnPlayer = false;
  @Input() footer?: SafeHtml;
  @Input() environment: Record<string, unknown> = {};

  @Output() itemClicked = new Subject<INotifyAdvancedProfileItem>();

  public get background() {
    return this._apItems.getSystemManifests('background');
  }

  public get advancedProfile() {
    return this.profile.advancedProfile;
  }

  public get verticalSpacing() {
    const value = this.advancedProfile?.pageSettings.verticalSpacing || 0;

    return `${value}rem`;
  }

  public get advancedProfileItems() {
    return this.advancedProfile?.items.map((i) => ({
      data: i,
      manifest: this._apItems.getManifest(i.type),
    }));
  }
}
