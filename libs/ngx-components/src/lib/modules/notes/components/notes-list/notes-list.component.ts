import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotifyNote } from '@notify/interfaces';

@Component({
  selector: 'notify-notes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.scss',
})
export class NotesListComponent {
  @Input() public notes: INotifyNote[] = [];

  @Output() public deleteNote = new EventEmitter<INotifyNote['_id']>();
  @Output() public shareNote = new EventEmitter<INotifyNote>();
  @Output() public editNote = new EventEmitter<INotifyNote['_id']>();
}
