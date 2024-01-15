import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotifyNote } from '@notify/interfaces';
import { NoItemsComponent } from '../../../../standalones/no-items/no-items.component';

@Component({
  selector: 'notify-notes-list',
  standalone: true,
  imports: [CommonModule, NoItemsComponent],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.scss',
})
export class NotesListComponent {
  @Input() public notes: INotifyNote[] = [];

  @Output() public deleteNote = new EventEmitter<INotifyNote['_id']>();
  @Output() public shareNote = new EventEmitter<INotifyNote>();
  @Output() public editNote = new EventEmitter<INotifyNote['_id']>();
}
