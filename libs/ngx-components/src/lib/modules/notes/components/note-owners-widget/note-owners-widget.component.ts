import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'notify-note-owners-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-owners-widget.component.html',
  styleUrls: ['./note-owners-widget.component.scss', '../../notes.styles.scss'],
})
export class NoteOwnersWidgetComponent {
  @Input() owners: string[] = [];
}
