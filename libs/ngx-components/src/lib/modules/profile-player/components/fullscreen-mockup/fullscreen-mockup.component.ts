import { CommonModule } from '@angular/common';
import { Component, ComponentRef, HostListener, Input } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';

import { ShareProfileComponent } from '../../../../standalones/share-profile/share-profile.component';
import { ProfileViewComponent } from '../profile-view/profile-view.component';

@Component({
  selector: 'notify-fullscreen-mockup',
  standalone: true,
  imports: [CommonModule, ProfileViewComponent, ShareProfileComponent],
  templateUrl: './fullscreen-mockup.component.html',
  styleUrls: ['./fullscreen-mockup.component.scss', '../profile.styles.scss'],
})
export class FullscreenMockupComponent {
  @Input({ required: true }) data!: INotifyProfile;
  @Input({ required: true }) baseUrl?: string;
  @Input() cf!: ComponentRef<FullscreenMockupComponent>;

  constructor() {}

  @HostListener('document:keydown.escape', ['$event'])
  public close() {
    this.cf.destroy();
  }
}
