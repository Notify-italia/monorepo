import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { INotifyNote } from '@notify/interfaces';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-note-header',
  standalone: true,
  imports: [
    CommonModule,
    TailwindFormsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './note-header.component.html',
  styleUrls: ['./note-header.component.scss', '../../notes.styles.scss'],
})
export class NoteHeaderComponent implements OnInit, OnDestroy {
  @Input({ required: true }) note!: INotifyNote;
  @Output() formValue = new EventEmitter<{ title: string; color: string }>();

  public form?: FormGroup;

  private destroy$ = new Subject<void>();
  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(this.note.title),
      color: new FormControl(this.note.color),
    });

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(500))
      .subscribe((value) => {
        this.formValue.emit(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
