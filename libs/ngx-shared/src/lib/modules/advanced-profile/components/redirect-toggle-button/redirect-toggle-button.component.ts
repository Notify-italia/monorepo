import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'notify-redirect-toggle-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './redirect-toggle-button.component.html',
})
export class RedirectToggleButtonComponent {
  @Input() redirectEnabled = false;

  @Output() toggleProfileRedirect = new EventEmitter<boolean>();
}
