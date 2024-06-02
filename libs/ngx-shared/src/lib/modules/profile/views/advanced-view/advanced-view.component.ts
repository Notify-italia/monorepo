import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { INotifyProfile } from '@notify/interfaces';
import { AdvancedProfilePlayerComponent } from '../../../advanced-profile/ap.player.component';

@Component({
  selector: '[notify-advanced-view]',
  standalone: true,
  imports: [CommonModule, AdvancedProfilePlayerComponent],
  template: `
    <notify-ap-player
      class="w-full h-full"
      [profile]="data"
      [footer]="footer"
      [contained]="mockup"
      [environment]="environment"
      [isRunningOnPlayer]="isRunningOnPlayer"
    ></notify-ap-player>
  `,
})
export class AdvancedViewComponent {
  @Input() public data!: INotifyProfile;
  @Input() public footer?: SafeHtml;
  @Input() public mockup = false;
  @Input() public isRunningOnPlayer = false;
  @Input() public environment: Record<string, unknown> = {};
}
