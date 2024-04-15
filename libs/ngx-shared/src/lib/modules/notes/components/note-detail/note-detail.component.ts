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
import { SaveIndicatorComponent } from '../../../../standalones';
import { NoItemsComponent } from '../../../../standalones/no-items/no-items.component';
import { ConfirmModalFactory } from '../../../modals';
import { INotifyShareItemConfig, ShareItemComponent } from '../../../profile';
import { NoteChecklistItemComponent } from '../items/note-checklist-item/note-checklist-item.component';
import { NoteHeaderComponent } from '../items/note-header/note-header.component';
import { NoteLinkItemComponent } from '../items/note-link-item/note-link-item.component';
import { NoteMenuComponent } from '../items/note-menu/note-menu.component';
import { NoteTextItemComponent } from '../items/note-text-item/note-text-item.component';
import { NoteOwnersWidgetComponent } from '../note-owners-widget/note-owners-widget.component';

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

  constructor(private _confirmModal: ConfirmModalFactory) {}

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
      confirmClass: this._confirmModal.deleteBtn,
      value: true,
    });

    ref.instance.submitted.subscribe((value) => {
      if (!value) {
        return;
      }

      this.currentNote.items.splice(index, 1);
      this.noteChanged.emit(this.currentNote);
    });
  }
}
