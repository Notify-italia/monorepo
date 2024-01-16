import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { ProfileService } from '@notify/nfc-app-services';

@Component({
  selector: 'notify-profile-static-links',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-static-links.component.html',
  styleUrls: [
    './profile-static-links.component.scss',
    '../profile.styles.scss',
  ],
})
export class ProfileStaticLinksComponent {
  @Input() data?: INotifyProfile;
  @Input() gradientStops?: string;

  constructor(private _profileService: ProfileService) {}

  public get isVisible(): boolean {
    const config = this.data?.config;

    if (!config) {
      return false;
    }

    return (
      config?.emailEnabled ||
      config?.phoneCallEnabled ||
      config?.whatsappEnabled ||
      config?.smsEnabled
    );
  }

  public cleanPhoneNumber(phoneNumber: string): string {
    return this._profileService.cleanPhoneNumber(phoneNumber);
  }
}
