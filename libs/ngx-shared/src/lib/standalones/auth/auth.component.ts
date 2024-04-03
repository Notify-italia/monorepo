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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { INotifyAuth } from '@notify/interfaces';
import { Subject, takeUntil, tap } from 'rxjs';
import { TailwindFormsModule } from '../../modules/tailwind-forms/tailwind-forms.module';
import { passwordMatchValidator } from '../../validators';
import { WallpaperComponent } from '../animated-bg/wallpaper.component';
import { AppTitleComponent } from '../app-title/app-title.component';

export interface IAuthConfig {
  submitLabel: string;
  pageSubtitle: string;
  pageTitle: string;
  signupRoute?: string;
  forgotPasswordRoute?: string;
  isSignup?: boolean;
}

@Component({
  selector: 'notify-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TailwindFormsModule,
    AppTitleComponent,
    WallpaperComponent,
    RouterModule,
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  @Input() public config: IAuthConfig = {
    submitLabel: 'Entra',
    pageSubtitle: '',
    pageTitle: "Effettua l'accesso",
    signupRoute: '',
    forgotPasswordRoute: '',
    isSignup: false,
  };
  @Input() public loading = false;
  @Output() formSubmitted = new EventEmitter<INotifyAuth>();

  public destroy$ = new Subject<void>();

  public validationErrors = {
    required: ' ',
    email: 'Email non valida!',
    minlength: 'almeno 6 caratteri',
    passwordMatch: 'Le password non coincidono',
  };

  private get _passwordValidators() {
    const _staticValidators = [Validators.required, Validators.minLength(6)];

    if (this.config.isSignup) {
      return [..._staticValidators, passwordMatchValidator];
    }

    return _staticValidators;
  }

  public form: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword?: FormControl<string | null>;
  }> = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', this._passwordValidators),
  });

  public submit() {
    if (!this.form.valid) {
      return;
    }

    this.formSubmitted.emit(this.form.value as INotifyAuth);
  }

  ngOnInit(): void {
    if (this.config.isSignup) {
      this.form.addControl(
        'confirmPassword',
        new FormControl('', this._passwordValidators)
      );
    }

    this.form.controls.password.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          if (!this.config.isSignup) {
            return;
          }
          this.form.controls.confirmPassword?.updateValueAndValidity();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
