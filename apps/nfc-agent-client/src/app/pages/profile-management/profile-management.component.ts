import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ProfileFormComponent,
  ProfileViewComponent,
} from '@notify/nfc-app-components';

@Component({
  selector: 'notify-profile-management',
  standalone: true,
  imports: [CommonModule, ProfileFormComponent, ProfileViewComponent],
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent {}
