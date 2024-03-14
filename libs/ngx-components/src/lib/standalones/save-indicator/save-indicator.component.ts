import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'notify-save-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './save-indicator.component.html',
  styleUrl: './save-indicator.component.scss',
})
export class SaveIndicatorComponent {
  @Input() isSaving = false;
  @Input() lastSave = new Date();
  @Input() followPage = false;

  @Output() save = new EventEmitter<void>();
}
