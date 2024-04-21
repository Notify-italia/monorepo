import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { INotifyNote, INotifyUser } from '@notify/interfaces';

@Component({
  selector: 'notify-note-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-view.component.html',
  styleUrl: './note-view.component.scss',
})
export class NoteViewComponent {
  @Input({ required: true }) note!: INotifyNote & { owners: INotifyUser[] };

  public get textColor() {
    const r = parseInt(this.note.color.slice(1, 3), 16);
    const g = parseInt(this.note.color.slice(3, 5), 16);
    const b = parseInt(this.note.color.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  }
}
