import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AuthService,
  EnumDicebearAvatarStyles,
} from '@notify/nfc-app-services';
import { AvatarComponent, PageHeaderComponent } from '@notify/ngx-components';

@Component({
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, AvatarComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  public dicebearStyles = EnumDicebearAvatarStyles;
  public get user() {
    return this._authService.user;
  }

  constructor(private _authService: AuthService) {}
}
