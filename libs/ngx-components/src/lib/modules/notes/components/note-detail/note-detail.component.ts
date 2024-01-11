import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  EnumNotifyNoteItemType,
  INotifyNote,
  INotifyNoteHeader,
  INotifyNoteItemValue,
} from '@notify/interfaces';
import { ConfirmModalFactory } from '../../../modals';
import { NoteChecklistItemComponent } from '../note-checklist-item/note-checklist-item.component';
import { NoteHeaderComponent } from '../note-header/note-header.component';
import { NoteLinkItemComponent } from '../note-link-item/note-link-item.component';
import { NoteMenuComponent } from '../note-menu/note-menu.component';
import { NoteTextItemComponent } from '../note-text-item/note-text-item.component';

@Component({
  selector: 'notify-note-detail',
  standalone: true,
  imports: [
    CommonModule,
    NoteHeaderComponent,
    NoteMenuComponent,
    NoteTextItemComponent,
    NoteLinkItemComponent,
    NoteChecklistItemComponent,
  ],
  providers: [ConfirmModalFactory],
  templateUrl: './note-detail.component.html',
  styleUrl: './note-detail.component.scss',
})
export class NoteDetailComponent implements OnInit {
  @Input({ required: true }) note!: INotifyNote;

  @Output() noteChanged = new EventEmitter<INotifyNote>();

  public currentNote!: INotifyNote;
  public EnumNotifyNoteItemType = EnumNotifyNoteItemType;

  constructor(private _confirmModal: ConfirmModalFactory) {}

  ngOnInit() {
    this.currentNote = this.note;
  }

  public headerChanged(value: INotifyNoteHeader | null) {
    if (!value) {
      return;
    }
    this.currentNote.title = value.title;
    this.currentNote.color = value.color;
    this.noteChanged.emit(this.currentNote);
  }

  public itemChanged(item: INotifyNoteItemValue | null, index: number) {
    this.currentNote.items[index].value = item;
    this.noteChanged.emit(this.currentNote);
  }

  public addItem(itemType: EnumNotifyNoteItemType) {
    this.currentNote.items.push({
      type: itemType,
      value: null,
    });
    this.noteChanged.emit(this.currentNote);
  }

  public deleteItem(index: number) {
    const ref = this._confirmModal.create({
      title: 'Elimina Oggetto',
      description: 'Sei sicuro di voler eliminare questo oggetto?',
      confirmText: 'Elimina',
      cancelText: 'Annulla',
      closeOnConfirm: true,
      confirmClass: 'btn btn-error !text-white',
      value: true,
    });

    ref.instance.submitted.subscribe((value) => {
      console.log(value);
      if (!value) {
        return;
      }

      this.currentNote.items.splice(index, 1);
      this.noteChanged.emit(this.currentNote);
    });
  }
}
