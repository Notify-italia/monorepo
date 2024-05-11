import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { ProfileService } from '../../../../services';

@Component({
  selector: '[notify-advanced-view]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advanced-view.component.html',
  styleUrl: './advanced-view.component.scss',
})
export class AdvancedViewComponent {
  public profileService = inject(ProfileService);

  @Input() public data: INotifyProfile['advancedProfile'];
}
