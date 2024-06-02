import { Component, inject } from '@angular/core';

import { INotifyAPNoteItem } from '@notify/interfaces';
import { Observable, map } from 'rxjs';
import {
  AdvancedItemFormBaseImports,
  AdvancedItemFormBaseProviders,
  AdvancedProfileItemFormBaseComponent,
} from '../../../../constructors/ap-item.form.base.component';
import { NoteService } from '../../../../services';
import { ITailwindSelectOption } from '../../../tailwind-forms/components/tailwind-select/tailwind-select.component';

@Component({
  standalone: true,
  imports: AdvancedItemFormBaseImports,
  providers: [...AdvancedItemFormBaseProviders, NoteService],
  styleUrls: ['../../advanced-profile.styles.scss'],
  template: `
    @if(notesSelect$ | async; as notes) {
    <div class="flex space-x-2  items-end">
      <notify-tailwind-select
        [parent]="form"
        name="note"
        class="w-full"
        label="Nota"
        placeholder="Nessun progetto"
        [options]="notes"
        [compact]="true"
      ></notify-tailwind-select>

      <div class="tooltip tooltip-left" data-tip="Vai alla nota">
        <button
          [routerLink]="['/pages/notes/inspect']"
          [queryParams]="{
            id: form.value.note,
            returnUrl: '/pages/profile/editor'
          }"
          class="btn btn-outline shrink-0 btn-square mb-[0.2rem]  btn-sm"
          [ngClass]="{
          'pointer-events-none opacity-50': !form.value.note,
        }"
          target="_blank"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
            ></path>
            <path d="M15 3h6v6"></path>
            <path d="M10 14 21 3"></path>
          </svg>
        </button>
      </div>
    </div>
    } @else {
    <notify-loading></notify-loading>
    }
  `,
})
export class NoteFormComponent extends AdvancedProfileItemFormBaseComponent<INotifyAPNoteItem> {
  private _noteService = inject(NoteService);

  public notesSelect$: Observable<ITailwindSelectOption[]> = this._noteService
    .getNotes()
    .pipe(
      map((notes) =>
        notes.map((note) => ({
          name: note.title,
          value: note._id,
        }))
      )
    );
}
