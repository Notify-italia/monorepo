import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AppTitleComponent } from '../../../../standalones/app-title/app-title.component';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-recover-password-form',
  standalone: true,
  imports: [
    CommonModule,
    AppTitleComponent,
    TailwindFormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './recover-password-form.component.html',
  styleUrl: './recover-password-form.component.scss',
})
export class RecoverPasswordFormComponent {
  @Input() public config = {
    pageTitle: 'Recupera password',
    submitLabel: 'Invia email di recupero',
    pageSubtitle: 'Dashboard',
    signinRoute: '/signin',
  };
  @Input() public loading = false;
  @Output() public submitted = new EventEmitter<string>();

  public validationErrors = {
    required: 'Inserisci un indirizzo email',
    email: 'Inserisci un indirizzo email valido',
  };

  public form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  public submit() {
    if (!this.form.valid) {
      return;
    }
    this.submitted.emit(this.form.value.email as string);
  }
}
