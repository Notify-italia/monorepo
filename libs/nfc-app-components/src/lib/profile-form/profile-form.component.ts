import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil, tap } from 'rxjs';
import { TailwindFormsModule } from '../tailwind-forms/tailwind-forms.module';

type ProfileForm = FormGroup<{
  name: FormControl<string | null>;
  surname: FormControl<string | null>;
  email: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  linkedIn: FormControl<string | null>;
  bio: FormControl<string | null>;
}>;

enum Patterns {
  linkedIn = '',
  italianMobile = '',
}

@Component({
  selector: 'notify-profile-form',
  standalone: true,
  imports: [CommonModule, TailwindFormsModule, ReactiveFormsModule],
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit {
  @Output() public value = new EventEmitter<ProfileForm['value']>();

  private _destroy$ = new Subject<void>();

  public form: ProfileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    phoneNumber: new FormControl('', [
      Validators.pattern(/^3\d{2}[.\s]?\d{6,7}$/),
    ]),
    linkedIn: new FormControl('', [
      Validators.pattern(
        /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]{5,30}\/?$/
      ),
    ]),
    bio: new FormControl('', []),
  });

  public validationErrors = {
    required: ' ',
    email: 'Email non valida',
    pattern: 'Valore non valido',
  };

  public ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        tap((value) => {
          if (this.form.invalid) {
            return;
          }

          this.value.emit(value);
        })
      )
      .subscribe();
  }
}
