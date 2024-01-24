import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { INotifyLicense } from '@notify/interfaces';
import { AuthService } from '@notify/nfc-app-services';
import {
  LicenseFormFactory,
  LicenseInfoComponent,
  NoItemsComponent,
  PageHeaderComponent,
} from '@notify/ngx-components';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    LicenseInfoComponent,
    PageHeaderComponent,
    NoItemsComponent,
  ],
  providers: [LicenseFormFactory],
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
})
export class LicenseComponent {
  public license = this._authService.user?.license as unknown as INotifyLicense;

  public activeLicense = this._authService.activeLicense;
  public daysLeft = 0;

  constructor(
    private _authService: AuthService,
    private _license: LicenseFormFactory
  ) {}

  public handleButtonClick(event: string): void {
    switch (event) {
      case 'addLicense':
        this._addLicense();
        break;
      case 'contactUs':
        this._contactUs();
        break;
      default:
        break;
    }
  }

  private _addLicense(): void {
    this._license.create();
  }

  private _contactUs(): void {
    window.location.href = 'mailto:preventivi@notifyapp.it';
  }
}
