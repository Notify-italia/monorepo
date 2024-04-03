import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { INotifyNote, INotifyNoteItemValue } from '@notify/interfaces';
import { Subject, debounceTime, takeUntil } from 'rxjs';

export const NOTE_DEBOUNCE_TIME = 1000;

@Component({
  template: '',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class NoteItemBaseComponent implements OnInit, OnDestroy {
  @Input() item!: INotifyNote['items'][0];
  @Input() note?: INotifyNote;

  @Output() formValue = new EventEmitter<INotifyNoteItemValue>();
  @Output() deleteNoteItem = new EventEmitter<void>();

  public form!: FormGroup;
  public destroy$ = new Subject<void>();

  public validationErrors = {
    required: ' ',
  };

  ngOnInit(): void {
    this.componentInit();

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(NOTE_DEBOUNCE_TIME))
      .subscribe((formValue) => this.formValue.emit(formValue));

    return;
  }

  public componentInit(): void {
    return;
  }

  public componentDestroyed(): void {
    return;
  }

  public componentReady(): void {
    return;
  }

  public initForm(value: FormGroup): void {
    this.form = value;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.componentDestroyed();
  }
}
