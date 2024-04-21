import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { INotifyNoteItemLink } from '@notify/interfaces';
import { NoteItemBaseComponent } from '../../../../constructors/note-item.base.component';
import { UtilsService } from '../../../../services';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-note-link-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TailwindFormsModule,
  ],
  providers: [UtilsService],
  template: `
    <a
      class="flex w-full justify-center items-center space-x-4 hover:underline"
      [href]="redirectUrl"
      target="_blank"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-8 h-8"
      >
        <path
          fill-rule="evenodd"
          d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z"
          clip-rule="evenodd"
        />
      </svg>

      <span class="font-bold text-2xl my-auto ">
        {{ itemValue.title || 'Inserisci un titolo' }}
      </span>
    </a>
  `,
  styleUrls: ['../../notes.styles.scss'],
})
export class NotePlayerLinkItemComponent extends NoteItemBaseComponent {
  public get itemValue() {
    return this.item.value as INotifyNoteItemLink;
  }

  public get redirectUrl() {
    const url = this.itemValue.url;

    if (!url) {
      return null;
    }

    return this._domSanitizer.bypassSecurityTrustResourceUrl(
      this._utilsService.populateWebProtocol('https://', url)
    );
  }

  constructor(
    private _domSanitizer: DomSanitizer,
    private _utilsService: UtilsService
  ) {
    super();
  }
}
