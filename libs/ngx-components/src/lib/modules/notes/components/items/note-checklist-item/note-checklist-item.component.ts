import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyNoteItemChecklist } from '@notify/interfaces';
import { TailwindFormsModule } from '../../../../tailwind-forms/tailwind-forms.module';
import { NoteItemBase } from '../note-item.base';

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
    '../../../notes.styles.scss',
  ],
})
export class NoteChecklistItemComponent extends NoteItemBase {
  //viewchildern inputs
  @ViewChildren('DescriptionInput') inputs!: QueryList<ElementRef>;

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

  @HostListener('keydown.enter', ['$event'])
  public addItem() {
    (this.form.get('items') as FormArray).push(
      new FormGroup({
        description: new FormControl('', Validators.required),
        checked: new FormControl(false),
      })
    );
    setTimeout(() => {
      this._focusLastInput();
    }, 1);
  }

  public removeItem(index: number) {
    if (isNaN(index)) {
      index = (this.form.get('items') as FormArray).length - 1;
    }
    const arr = this.form.get('items') as FormArray;
    arr.removeAt(index);
  }

  private _focusLastInput() {
    this.inputs.last.nativeElement.focus({ preventScroll: false });
  }
}
