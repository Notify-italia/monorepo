import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CapacitorService } from '../../../../services';

@Component({
  selector: 'notify-redirect-toggle-button',
  standalone: true,
  imports: [CommonModule],
  providers: [CapacitorService],
  templateUrl: './redirect-toggle-button.component.html',
})
export class RedirectToggleButtonComponent {
  private _capacitorService = inject(CapacitorService);
  @Input() redirectEnabled = false;

  @Output() toggleProfileRedirect = new EventEmitter<boolean>();

  public toggleSelection() {
    this._capacitorService.triggerHapticFeedback(
      this._capacitorService.hFeedbackStyles.Success
    );

    this.toggleProfileRedirect.emit(!this.redirectEnabled);
  }
}
