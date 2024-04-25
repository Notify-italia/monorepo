import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { INotifyNoteItemFile, INotifyNoteItemFiles } from '@notify/interfaces';
import { NoteItemBaseComponent } from '../../../../constructors/note-item.base.component';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-note-files-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TailwindFormsModule,
  ],
  template: `
    <div class=" w-full overflow-x-hidden flex flex-col space-y-2">
      <span class="font-bold text-xl ">{{ itemValue.title }}</span>

      <div id="carousel-{{ item._id }}" class="flex  w-full h-full space-x-2 ">
        @for (i of itemFiles;track $index) {
        <div
          class="flex flex-col items-center justify-center smooth cursor-pointer"
          (click)="goToItem($index)"
          [class.opacity-50]="$index !== currentItem"
        >
          <div class="carousel-item" id="slide-{{ item._id }}-{{ $index }}">
            <a
              [href]="i.url"
              target="_blank"
              [class.pointer-events-none]="$index !== currentItem"
            >
              <img
                (load)="Skeleton.hidden = true"
                [src]="i.thumb"
                [alt]="i.name"
                class="w-fit h-full rounded-lg max-w-40 max-h-28 object-contain !text-current"
                [ngClass]="{
                  'w-72 h-72': !i.isImage
                }"
              />
              <div
                #Skeleton
                class="object-cover smooth bg-gray-600 animate-pulse w-96 h-72 rounded-lg absolute"
              ></div>
            </a>
          </div>
          <p class="text-center text-xs font-light max-w-36  truncate">
            {{ i.name }}
          </p>
        </div>

        }
      </div>
    </div>
  `,
  styleUrls: ['../../notes.styles.scss'],
})
export class NotePlayerFilesItemComponent extends NoteItemBaseComponent {
  public currentItem = 0;

  public get itemValue() {
    return this.item.value as INotifyNoteItemFiles;
  }

  public get itemFiles() {
    return this.itemValue.files.map((f) => ({
      ...f,
      thumb: this._getThumbnail(f),
      isImage: f.type.startsWith('image'),
    }));
  }

  public goToItem(index: number) {
    this.currentItem = index;
    this._scrollToCurrentItem();
  }

  private _getThumbnail(file: INotifyNoteItemFile) {
    if (file.type.startsWith('image')) {
      return file.url;
    }

    //is pdf
    if (file.type.startsWith('application/pdf')) {
      return 'https://s3-api.vps.notifyapp.it/assets/files-icon/pdf.png';
    }
    return 'https://s3-api.vps.notifyapp.it/assets/files-icon/generic.png';
  }

  private _scrollToCurrentItem() {
    //slide to current item in carousel WITHOUT using scrollIntoView
    const slide = document.getElementById(
      `slide-${this.item._id}-${this.currentItem}`
    );

    if (!slide) {
      return;
    }

    const carousel = document.getElementById(`carousel-${this.item._id}`);

    if (!carousel) {
      return;
    }
    carousel.scrollTo({
      left: slide.offsetLeft - carousel.clientWidth / 2 + slide.clientWidth / 2,
      behavior: 'smooth',
    });
  }
}
