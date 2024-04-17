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
import { NoteItemBaseComponent } from '../../../../../constructors/note-item.base.component';
import { TailwindFormsModule } from '../../../../tailwind-forms/tailwind-forms.module';

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
export class NoteChecklistItemComponent extends NoteItemBaseComponent {
  //viewchildern inputs
  @ViewChildren('DescriptionInput') inputs!: QueryList<ElementRef>;

  override componentInit(): void {
    const itemValue = this.item.value as INotifyNoteItemChecklist;

    this.initForm(
      new FormGroup({
        title: new FormControl(itemValue?.title || 'Da fare', [
          Validators.required,
        ]),
        items: new FormArray(
          itemValue?.items?.map(
            (item) =>
              new FormGroup({
                description: new FormControl(item.description, [
                  Validators.required,
                ]),
                checked: new FormControl(item.checked),
              })
          ) ?? [
            new FormGroup({
              description: new FormControl('', Validators.required),
              checked: new FormControl(false),
            }),
          ]
        ),
      })
    );
  }

  @HostListener('keydown.enter', ['$event'])
  public addItem() {
    const index = this._getActiveElementIndex();

    (this.form.get('items') as FormArray).insert(
      index + 1,
      new FormGroup({
        description: new FormControl('', Validators.required),
        checked: new FormControl(false),
      })
    );
    setTimeout(() => {
      this._focusInput(index + 1);
    }, 1);
  }

  @HostListener('keydown.backspace', ['$event'])
  public removeItem(index: number) {
    if (!isNaN(index)) {
      const arr = this.form.get('items') as FormArray;
      arr.removeAt(index);
    }

    index = this._getActiveElementIndex();

    if (this.form.get('items')?.value[index].description.length) {
      return;
    }

    const arr = this.form.get('items') as FormArray;
    arr.removeAt(index);
    (document.activeElement as HTMLInputElement)?.blur();

    setTimeout(() => {
      this._focusInput(index - 1);
    }, 1);
  }

  private _focusInput(index: number) {
    this.inputs
      .toArray()
      [index]?.nativeElement?.focus({ preventScroll: false });
  }

  private _getActiveElementIndex() {
    const dataIndex = parseInt(
      document.activeElement?.getAttribute('data-index') || ''
    );

    return isNaN(dataIndex)
      ? this.form.controls['items'].value.length - 1
      : dataIndex;
  }
}
