import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { INotifyLicense } from '@notify/interfaces';
import { AuthService } from '@notify/nfc-app-services';
import {
  LicenseInfoComponent,
  PageHeaderComponent,
} from '@notify/ngx-components';

@Component({
  standalone: true,
  imports: [CommonModule, LicenseInfoComponent, PageHeaderComponent],
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
})
export class LicenseComponent {
  public license = this._authService.user?.license as unknown as INotifyLicense;

  public daysLeft = 0;

  constructor(private _authService: AuthService) {}
}
