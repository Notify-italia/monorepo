import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyAuth } from '@notify/nfc-interfaces';
import { AnimatedBgComponent } from '../animated-bg/animated-bg.component';
import { AppTitleComponent } from '../app-title/app-title.component';
import { TailwindFormsModule } from '../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TailwindFormsModule,
    AppTitleComponent,
    AnimatedBgComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  @Input() public config = {
    submitLabel: 'Entra',
    pageTitle: "Effettua l'accesso",
  };
  @Input() public loading = false;
  @Output() formSubmitted = new EventEmitter<INotifyAuth>();

  public validationErrors = {
    required: 'Questo campo è richiesto',
    email: 'Inserisci un indirizzo email valido',
    minlength: 'La password deve essere di almeno 6 caratteri',
  };

  public form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  public submit() {
    if (!this.form.valid) {
      return;
    }

    this.formSubmitted.emit(this.form.value as INotifyAuth);
  }
}
