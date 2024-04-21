import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  EnumNotifyNoteItemType,
  INotifyNote,
  INotifyNoteItem,
  INotifyNoteItemValue,
} from '@notify/interfaces';
import { Subject, tap } from 'rxjs';
import { ConfirmModalFactory } from '../../../modals';
import { NoteChecklistItemComponent } from './note-checklist-item/note-checklist-item.component';
import { NoteFilesItemComponent } from './note-files-item/note-files-item.component';
import { NoteLinkItemComponent } from './note-link-item/note-link-item.component';
import { NotePhotoItemComponent } from './note-photo-item/note-photo-item.component';
import { NoteTextItemComponent } from './note-text-item/note-text-item.component';

@Component({
  selector: 'notify-note-item',
  standalone: true,
  imports: [
    CommonModule,
    NoteTextItemComponent,
    NoteLinkItemComponent,
    NoteChecklistItemComponent,
    NotePhotoItemComponent,
    NoteFilesItemComponent,
  ],
  template: `<div class="relative">
    <div class="absolute right-2 top-[0.6rem] z-20">
      <!-- DELETE NOTE -->
      <button
        type="button"
        class="action-btn action-error my-auto !rounded-lg !p-2 btn-md"
        data-theme="notifytheme"
        (click)="deleteItem()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="h-6 w-6"
        >
          <path
            fill-rule="evenodd"
            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    @switch (itemType) { @case (enumTypes.Text) {
    <notify-note-text-item
      [item]="item"
      [note]="currentNote"
      [itemDeleted$]="itemDeleted$"
      (deleteNoteItem)="deleteItem()"
      (formChanged)="sendItemChanged($event)"
    ></notify-note-text-item>

    } @case (enumTypes.Link) {
    <notify-note-link-item
      [item]="item"
      [note]="currentNote"
      [itemDeleted$]="itemDeleted$"
      (deleteNoteItem)="deleteItem()"
      (formChanged)="sendItemChanged($event)"
    ></notify-note-link-item>

    } @case (enumTypes.Checklist) {
    <notify-note-checklist-item
      [item]="item"
      [note]="currentNote"
      [itemDeleted$]="itemDeleted$"
      (deleteNoteItem)="deleteItem()"
      (formChanged)="sendItemChanged($event)"
    ></notify-note-checklist-item>

    } @case (enumTypes.Files) {
    <notify-note-files-item
      [item]="item"
      [note]="currentNote"
      [itemDeleted$]="itemDeleted$"
      (deleteNoteItem)="deleteItem()"
      (formChanged)="sendItemChanged($event)"
    ></notify-note-files-item>

    } @case (enumTypes.Photo) {
    <notify-note-photo-item
      [item]="item"
      [note]="currentNote"
      [itemDeleted$]="itemDeleted$"
      (deleteNoteItem)="deleteItem()"
      (formChanged)="sendItemChanged($event)"
    ></notify-note-photo-item>

    } }

    <small class=" absolute right-5 bottom-2 text-end">
      <span class="text-xs text-gray-500">
        Ultima modifica:
        {{ item.updatedAt | date : 'dd/MM/yyyy HH:mm' }}</span
      >
    </small>
  </div>`,
})
export class NoteItemComponent {
  private _confirmModal = inject(ConfirmModalFactory);

  @Input() item!: INotifyNoteItem;
  @Input() index!: number;
  @Input() currentNote!: INotifyNote;

  @Output() itemDeleted = new EventEmitter<void>();
  @Output() itemChanged = new EventEmitter<INotifyNoteItemValue>();

  public itemDeleted$ = new Subject<void>();

  public enumTypes = EnumNotifyNoteItemType;

  public get itemType() {
    return this.item.type;
  }

  public sendItemChanged(item: INotifyNoteItemValue): void {
    this.itemChanged.emit(item);
  }

  public deleteItem() {
    const ref = this._confirmModal.create({
      title: 'Elimina Oggetto',
      description: 'Sei sicuro di voler eliminare questo oggetto?',
      confirmText: 'Elimina',
      cancelText: 'Annulla',
      closeOnConfirm: true,
      confirmClass: this._confirmModal.deleteBtn,
      value: true,
    });

    ref.instance.submitted
      .pipe(
        tap((value) => {
          if (!value) {
            return;
          }

          this.itemDeleted$.next();
          this.itemDeleted.emit();
        })
      )
      .subscribe();
  }
}
