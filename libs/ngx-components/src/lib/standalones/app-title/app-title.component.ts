import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'notify-app-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-title.component.html',
  styleUrls: ['./app-title.component.scss'],
})
export class AppTitleComponent {
  @Input() compact = false;
  @Input() subtitle = '';
}
