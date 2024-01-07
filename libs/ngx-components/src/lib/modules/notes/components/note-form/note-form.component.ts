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
import { Subject, debounceTime, takeUntil, tap } from 'rxjs';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-note-form',
  standalone: true,
  imports: [
    CommonModule,
    TailwindFormsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.scss',
})
export class NoteFormComponent implements OnInit, OnDestroy {
  @Input() note: INotifyNote | undefined;
  @Output() public formValueChange = new EventEmitter<INotifyNote>();

  public form?: FormGroup;
  public destroy$ = new Subject<void>();

  public maxRows(textarea: HTMLElement): number {
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const maxHeight = window.innerHeight - 350;

    return Math.floor(maxHeight / lineHeight);
  }

  public ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(this.note?.title || ''),
      content: new FormControl(this.note?.content || ''),
      color: new FormControl(this.note?.color || this._randomColor()),
    });

    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        tap((value) => {
          console.log('value', value);
          this.formValueChange.emit(value);
        })
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Generates a random color that has an high saturation
   * @returns a random color in hex format
   */
  private _randomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
