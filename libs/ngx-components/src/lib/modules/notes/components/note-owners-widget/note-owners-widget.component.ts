import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'notify-note-owners-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-owners-widget.component.html',
  styleUrls: ['./note-owners-widget.component.scss', '../../notes.styles.scss'],
})
export class NoteOwnersWidgetComponent {
  @Input() owners: string[] = [];

  @Output() addOwner = new EventEmitter<void>();
  @Output() manageOwners = new EventEmitter<void>();
}
