import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ProfileFormComponent,
  ProfileViewComponent,
  ShareProfileComponent,
} from '@notify/nfc-app-components';
import { INotifyProfile } from '@notify/nfc-interfaces';

@Component({
  selector: 'notify-profile-management',
  standalone: true,
  imports: [
    CommonModule,
    ProfileFormComponent,
    ProfileViewComponent,
    ShareProfileComponent,
  ],
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent {
  formValue?: INotifyProfile;
}
