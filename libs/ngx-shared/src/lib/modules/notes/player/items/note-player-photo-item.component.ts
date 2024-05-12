import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { INotifyNoteItemPhoto } from '@notify/interfaces';
import { NoteItemBaseComponent } from '../../../../constructors/note-item.base.component';
import { AvatarComponent, UploadComponent } from '../../../../standalones';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-note-photo-item',
  standalone: true,
  imports: [
    CommonModule,
    TailwindFormsModule,
    ReactiveFormsModule,
    UploadComponent,
    AvatarComponent,
  ],
  template: `
    <div class="flex flex-col space-y-2" *ngIf="itemValue.url?.length">
      <p>
        <span class="font-bold text-xl">{{ itemValue.title }}</span>
      </p>
      <img
        [src]="itemValue?.url"
        class="w-full h-full object-cover rounded-lg"
      />
    </div>
  `,
  styleUrls: ['../../notes.styles.scss'],
})
export class NotePlayerPhotoItemComponent extends NoteItemBaseComponent {
  public get itemValue() {
    return this.item?.value as INotifyNoteItemPhoto;
  }
}
