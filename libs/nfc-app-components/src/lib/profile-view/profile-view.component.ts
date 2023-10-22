import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProfileFormComponent } from '../profile-form/profile-form.component';

@Component({
  selector: 'notify-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent {
  @Input() data?: ProfileFormComponent['form']['value'] & {
    company?: {
      name: string;
    };
  };
}
