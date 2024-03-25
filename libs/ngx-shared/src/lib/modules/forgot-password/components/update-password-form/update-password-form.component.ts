import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordMatchValidator } from '@notify/nfc-app-services';
import { AppTitleComponent } from '../../../../standalones/app-title/app-title.component';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-update-password-form',
  standalone: true,
  imports: [
    CommonModule,
    TailwindFormsModule,
    ReactiveFormsModule,
    AppTitleComponent,
  ],
  templateUrl: './update-password-form.component.html',
  styleUrl: './update-password-form.component.scss',
})
export class UpdatePasswordFormComponent {
  @Input() public config = {
    pageSubtitle: 'Dashboard',
  };
  @Input() public loading = false;
  @Output() public submitted = new EventEmitter<string>();

  public validationErrors = {
    required: ' ',
    email: 'Inserisci un indirizzo email valido',
    minlength: 'La password deve essere di almeno 6 caratteri',
    passwordMatch: 'Le password non coincidono',
  };

  private _validators = [Validators.required, Validators.minLength(6)];

  public form = new FormGroup({
    password: new FormControl('', this._validators),
    confirmPassword: new FormControl('', [
      ...this._validators,
      passwordMatchValidator,
    ]),
  });

  public submit() {
    if (!this.form.valid) {
      return;
    }
    this.submitted.emit(this.form.value.password as string);
  }
}
