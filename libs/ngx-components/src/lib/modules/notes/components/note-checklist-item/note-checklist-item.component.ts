import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyNoteItemChecklist } from '@notify/interfaces';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';
import { NoteItemBase } from '../../note-item.base';

@Component({
  selector: 'notify-note-checklist-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TailwindFormsModule,
  ],
  templateUrl: './note-checklist-item.component.html',
  styleUrls: [
    './note-checklist-item.component.scss',
    '../../notes.styles.scss',
  ],
})
export class NoteChecklistItemComponent extends NoteItemBase {
  override componentReady(): void {
    const itemValue = this.item.value as INotifyNoteItemChecklist;

    this.initForm(
      new FormGroup({
        title: new FormControl(itemValue?.title, [Validators.required]),
        items: new FormArray(
          itemValue?.items?.map(
            (item) =>
              new FormGroup({
                description: new FormControl(item.description, [
                  Validators.required,
                ]),
                checked: new FormControl(item.checked),
              })
          ) ?? []
        ),
      })
    );
  }

  public addItem() {
    (this.form.get('items') as FormArray).push(
      new FormGroup({
        description: new FormControl('', Validators.required),
        checked: new FormControl(false),
      })
    );
  }

  public removeItem(index: number) {
    (this.form.get('items') as FormArray).removeAt(index);
  }
}
