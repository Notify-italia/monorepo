import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { INotifyNoteItemChecklist } from '@notify/interfaces';
import { NoteItemBaseComponent } from '../../../../constructors/note-item.base.component';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-note-checklist-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TailwindFormsModule,
  ],
  template: `
    <div class="font-bold text-2xl my-auto  w-full text-center ">
      {{ itemValue.title || 'Inserisci un titolo' }}
    </div>
    <ul class="w-full my-2 flex flex-col items-center  font-caveat !text-xl">
      @for (item of itemValue.items; track $index) {

      <li
        [attr.data-index]="$index"
        class="!text-current  smooth !font-medium my-auto "
        [ngClass]="{
          'line-through opacity-50 !font-normal pointer-events-none':
            item.checked
        }"
        type="text"
        placeholder="Descrizione..."
      >
        {{ item.description }}
      </li>
      }
    </ul>
  `,
  styleUrls: ['../../notes.styles.scss'],
})
export class NotePlayerChecklistItemComponent extends NoteItemBaseComponent {
  //viewchildern inputs
  @ViewChildren('DescriptionInput') inputs!: QueryList<ElementRef>;

  public get itemValue() {
    return (this.item.value || {
      title: '',
      items: [],
    }) as INotifyNoteItemChecklist;
  }
}
