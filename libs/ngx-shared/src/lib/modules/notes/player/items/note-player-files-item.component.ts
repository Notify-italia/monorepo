import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { INotifyNoteItemFile, INotifyNoteItemFiles } from '@notify/interfaces';
import { NoteItemBaseComponent } from '../../../../constructors/note-item.base.component';
import { iframeFactory } from '../../../modals';
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
  providers: [iframeFactory],
  template: `
    <div class=" w-full  space-y-2 z-0">
      <span class="font-bold text-xl ">{{ itemValue.title }}</span>

      <div class="flex !w-full notify-scrollbar  space-x-2 ">
        @for (item of itemFiles; track $index) {
        <a class="file-container smooth" [href]="item.url">
          @switch (item.fileType) { @case ('image') {
          <img class="w-full h-full object-cover" src="{{ item.url }}" alt="" />
          } @case ('document') {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-8 h-8"
          >
            <path
              fill-rule="evenodd"
              d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
              clip-rule="evenodd"
            />
            <path
              d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z"
            />
          </svg>

          } @default {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z"
            />
            <path
              d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z"
            />
          </svg>

          } }
          <p class="truncate w-full text-center">
            <small>
              {{ item.name }}
            </small>
          </p>
        </a>
        }
      </div>
    </div>
  `,
  styles: `


  .file-container {
    @apply w-40 h-40 flex-shrink-0 flex-grow-0 flex-shrink-0 rounded-2xl overflow-hidden relative flex flex-col justify-center items-center  bg-white/20 p-2 lg:hover:scale-95 cursor-pointer;

    & img {
      @apply p-1 rounded-xl object-cover z-0 w-full h-full;
    }

    & svg {
  @apply w-20 h-full
}

  }

  `,
  styleUrls: ['../../notes.styles.scss'],
})
export class NotePlayerFilesItemComponent extends NoteItemBaseComponent {
  private iframeFactory = inject(iframeFactory);

  public currentItem = 0;

  public get itemValue() {
    return (this.item.value || {
      title: '',
      files: [],
    }) as INotifyNoteItemFiles;
  }

  public get itemFiles() {
    return this.itemValue?.files.map((f) => ({
      ...f,
      isImage: f.type.startsWith('image'),
      fileType: this._getFileType(f),
    }));
  }

  private _getFileType(file: INotifyNoteItemFile) {
    if (file.type.startsWith('image')) {
      return 'image';
    }
    if (file.type.startsWith('application/pdf') || file.type.endsWith('.pdf')) {
      return 'document';
    }
    return 'other';
  }

  //TODO aprire i file in un iframe a schermo intero ma solo se è disponibile la preview
  // public openLink(file: INotifyNoteItemFile) {
  //   this.iframeFactory.create({
  //     url: file.url,
  //     title: file.name,
  //     navbarStyle: {
  //       backgroundColor: '#000000',
  //       color: '#ffffff',
  //     },
  //   });
  // }
}
