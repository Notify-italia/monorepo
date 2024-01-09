import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { INotifyNote } from '@notify/interfaces';
import { NoteHeaderComponent } from '../note-header/note-header.component';

@Component({
  selector: 'notify-note-detail',
  standalone: true,
  imports: [CommonModule, NoteHeaderComponent],
  templateUrl: './note-detail.component.html',
  styleUrl: './note-detail.component.scss',
})
export class NoteDetailComponent implements OnInit {
  @Input({ required: true }) note!: INotifyNote;

  @Output() noteChanged = new EventEmitter<INotifyNote>();

  public currentNote!: INotifyNote;

  constructor() {}

  ngOnInit() {
    this.currentNote = this.note;
  }

  public headerChanged(value: { title: string; color: string }) {
    this.currentNote.title = value.title;
    this.currentNote.color = value.color;
    this.noteChanged.emit(this.currentNote);
  }

  public itemChanged(item: INotifyNote['items'][0], index: number) {
    this.currentNote.items[index] = item;
    this.noteChanged.emit(this.currentNote);
  }
}
