import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotifyActionButton } from '@notify/interfaces';

@Component({
  template: '',
})
export class PageLayoutBaseComponent {
  @Input({ required: true }) title = 'Placeholder Title';
  @Input() subtitle = '';
  @Input() buttons: INotifyActionButton[] = [];

  @Output() buttonClicked = new EventEmitter<
    INotifyActionButton['eventName']
  >();

  onButtonClicked(button: INotifyActionButton): void {
    this.buttonClicked.emit(button.eventName);
  }
}
