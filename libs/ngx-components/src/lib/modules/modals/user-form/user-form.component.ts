import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyAccount, INotifyPartialUser } from '@notify/interfaces';
import { Subject } from 'rxjs';
import { TailwindFormsModule } from '../../tailwind-forms/tailwind-forms.module';

export type IUserFormHiddenFields = (
  | 'email'
  | 'password'
  | 'role'
  | 'enabled'
)[];

export interface IUserFormPasswordFieldConfig {
  helpText: string;
  type: 'text' | 'password';
  required?: boolean;
  label?: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TailwindFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @Input({ required: true }) public cf!: ComponentRef<UserFormComponent>;
  @Input() public loading = false;
  @Input() public user: INotifyAccount | null = null;
  @Input() public createdRoles: string[] = [];
  @Input() public hiddenFields: IUserFormHiddenFields = [];
  @Input() public passwordFieldConfig: IUserFormPasswordFieldConfig = {
    helpText: 'Lascia vuoto per mantenere la password attuale',
    type: 'text',
    required: false,
  };

  @Output() public removeRole = new EventEmitter<string>();

  public submitted = new Subject<INotifyPartialUser>();

  public form!: FormGroup;
  public destroyed$ = new Subject<void>();

  public get isLoading() {
    return this.loading;
  }

  public validationErrors = {
    required: 'Campo obbligatorio',
    email: 'Campo non valido',
  };

  constructor() {}

  ngOnInit(): void {
    this.cf.onDestroy(() => {
      this.destroyed$.next();
      this.destroyed$.complete();
    });

    const _pwValidators =
      this.user && !this.passwordFieldConfig.required
        ? []
        : [...this._isRequired('password')];

    this.form = new FormGroup({
      enabled: new FormControl<boolean>(this.user?.enabled ?? true, []),
      email: new FormControl<string>(this.user?.email || '', [
        Validators.email,
        ...this._isRequired('email'),
      ]),
      password: new FormControl<string>('', [
        ..._pwValidators,
        Validators.minLength(6),
      ]),
      role: new FormControl<string>(
        this.user?.profile?.role || '',
        this._isRequired('role')
      ),
    });
  }

  private _isRequired(field: IUserFormHiddenFields[0]) {
    return this.hiddenFields.includes(field) ? [] : [Validators.required];
  }

  @HostListener('document:keydown.escape')
  close() {
    this.cf.destroy();
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    this.submitted.next(this.form.value);
  }
}
