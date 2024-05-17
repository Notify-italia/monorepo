import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { AdvancedProfilePlayerComponent } from '../../../advanced-profile/ap.player.component';

@Component({
  selector: '[notify-advanced-view]',
  standalone: true,
  imports: [CommonModule, AdvancedProfilePlayerComponent],
  templateUrl: './advanced-view.component.html',
  styleUrl: './advanced-view.component.scss',
})
export class AdvancedViewComponent {
  @Input() public data!: INotifyProfile;
  @Input() public mockup = false;
}
