import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface INotifyHeaderButton {
  label: string;
  disabled?: boolean;
  eventName: string;
  icon?: string[];
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

  @Output() buttonClicked = new EventEmitter<
    INotifyHeaderButton['eventName']
  >();

  onButtonClicked(button: INotifyHeaderButton): void {
    this.buttonClicked.emit(button.eventName);
  }
}
