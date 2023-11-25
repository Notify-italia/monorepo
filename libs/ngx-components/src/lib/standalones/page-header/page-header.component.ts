import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface INotifyHeaderButton {
  label: string;
  disabled?: boolean;
  eventName: string;
}

@Component({
  selector: 'notify-page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  @Input({ required: true }) title = 'Placeholder Title';
  @Input() subtitle = '';
  @Input() buttons: INotifyHeaderButton[] = [];
}
