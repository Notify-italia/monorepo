import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import {
  EnumNotifyNoteItemType,
  INotifyNote,
  INotifyNoteHeader,
  INotifyNoteItemValue,
} from '@notify/interfaces';
import mongoose from 'mongoose';
import { Subject } from 'rxjs';
import { SaveIndicatorComponent } from '../../../../standalones';
import { NoItemsComponent } from '../../../../standalones/no-items/no-items.component';
import { ConfirmModalFactory } from '../../../modals';
import { INotifyShareItemConfig, ShareItemComponent } from '../../../profile';
import { NoteHeaderComponent } from '../items/note-header/note-header.component';
import { NoteItemComponent } from '../items/note-item.component';
import { NoteMenuComponent } from '../items/note-menu/note-menu.component';
import { NoteOwnersWidgetComponent } from '../note-owners-widget/note-owners-widget.component';

@Component({
  selector: 'notify-note-detail',
  standalone: true,
  imports: [
    CommonModule,
    NoteHeaderComponent,
    NoteMenuComponent,
    NoteItemComponent,
    NoItemsComponent,
    NoteOwnersWidgetComponent,
    ShareItemComponent,
    SaveIndicatorComponent,
  ],
  providers: [ConfirmModalFactory],
  templateUrl: './note-detail.component.html',
  styleUrl: './note-detail.component.scss',
})
export class NoteDetailComponent implements OnInit, OnChanges {
  @Input({ required: true }) note!: INotifyNote;
  @Input({ required: true }) baseUrl!: string;
  @Input() loading = false;

  @Output() noteChanged = new EventEmitter<INotifyNote>();
  @Output() addOwner = new EventEmitter<void>();
  @Output() manageOwners = new EventEmitter<void>();

  public itemDeleted$ = new Subject<number>();

  public currentNote!: INotifyNote;
  public EnumNotifyNoteItemType = EnumNotifyNoteItemType;

  public get shareConfig(): INotifyShareItemConfig {
    return {
      type: 'note',
      id: this.note._id,
      baseUrl: this.baseUrl,
      isInModal: false,
      qrcode: {
        fileName: this.note.title,
        title: 'Condividi questa nota',
      },
      nfc: {
        items: [
          {
            label: 'Scrivi questa nota',
            value: this.note._id,
          },
        ],
        questionLabel: 'Condividi questa nota',
        confirmationLabel: 'Condividi',
      },
    };
  }

  ngOnInit() {
    this.currentNote = this.note;
  }

  ngOnChanges(): void {
    this.currentNote = this.note;
  }

  public headerChanged(value: INotifyNoteHeader | null) {
    if (!value) {
      return;
    }
    //aggiorno il titolo e il colore della nota
    this.currentNote.title = value.title;
    this.currentNote.color = value.color;

    //emetto l'evento di aggiornamento della nota
    this.noteChanged.emit(this.currentNote);
  }

  public itemChanged(item: INotifyNoteItemValue | null, index: number) {
    if (!item || !this.currentNote.items[index]) {
      return;
    }

    //aggiorno la value e la data di aggiornamento dell'item
    this.currentNote.items[index].value = item;
    this.currentNote.items[index].updatedAt = new Date();

    //emetto l'evento di aggiornamento della nota
    this.noteChanged.emit(this.currentNote);
  }

  public addItem(itemType: EnumNotifyNoteItemType) {
    //clono la nota corrente
    const _cnote = Object.assign({}, this.currentNote);

    //aggiungo un nuovo item alla nota
    _cnote.items.push({
      type: itemType,
      value: null,
      _id: this._generateMongoID(),
      createdAt: new Date(),
    });

    //emetto l'evento di aggiornamento della nota
    this.noteChanged.emit(_cnote);
  }

  public deleteItem(index: number) {
    //rimuovo l'item dalla nota
    this.currentNote.items.splice(index, 1);

    //emetto l'evento di aggiornamento della nota
    this.noteChanged.emit(this.currentNote);
  }

  public _generateMongoID(): string {
    return new mongoose.Types.ObjectId().toHexString();
  }
}
