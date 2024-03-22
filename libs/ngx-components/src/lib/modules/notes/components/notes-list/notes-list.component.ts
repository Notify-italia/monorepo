import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotifyNote } from '@notify/interfaces';
import { Observable } from 'rxjs';
import { LoadingComponent } from '../../../../standalones/loading/loading.component';
import { NoItemsComponent } from '../../../../standalones/no-items/no-items.component';
import { SearchBarComponent } from '../../../../standalones/search-bar/search-bar.component';

@Component({
  selector: 'notify-notes-list',
  standalone: true,
  imports: [
    CommonModule,
    NoItemsComponent,
    LoadingComponent,
    SearchBarComponent,
  ],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.scss',
})
export class NotesListComponent {
  @Input() public notes$!: Observable<INotifyNote[]>;

  @Output() public deleteNote = new EventEmitter<INotifyNote['_id']>();
  @Output() public shareNote = new EventEmitter<INotifyNote>();
  @Output() public editNote = new EventEmitter<INotifyNote['_id']>();

  public notes: INotifyNote[] | null = null;
}
