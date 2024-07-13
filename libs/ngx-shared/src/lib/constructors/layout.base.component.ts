import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { INotifyActionButton } from '@notify/interfaces';
import { CapacitorService } from '../services';

export const pageLayoutBaseComponentProviders = [CapacitorService];

@Component({
  template: '',
})
export class PageLayoutBaseComponent {
  private _capacitorService = inject(CapacitorService);
  @Input({ required: true }) title = 'Placeholder Title';
  @Input() subtitle = '';
  @Input() buttons: INotifyActionButton[] = [];

  @Output() buttonClicked = new EventEmitter<
    INotifyActionButton['eventName']
  >();

  onButtonClicked(button: INotifyActionButton): void {
    this._capacitorService.itemClickedHapticFeedback();
    this.buttonClicked.emit(button.eventName);
  }
}
