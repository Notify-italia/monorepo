import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { INotifyNoteItemValue } from '@notify/interfaces';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { NOTE_DEBOUNCE_TIME } from './note.consts';

@Component({
  template: '',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class NoteItemBase implements OnInit, OnDestroy {
  @Output() formValue = new EventEmitter<INotifyNoteItemValue>();
  @Output() deleteNoteItem = new EventEmitter<void>();

  public form!: FormGroup;
  public destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.componentReady();

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(NOTE_DEBOUNCE_TIME))
      .subscribe((formValue) =>
        this.formValue.emit(this.publishChanges(formValue))
      );

    return;
  }

  public componentReady(): void {
    return;
  }

  public componentDestroyed(): void {
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

  public publishChanges(f: INotifyNoteItemValue) {
    return f;
  }
}
