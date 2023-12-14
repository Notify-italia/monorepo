import { CommonModule } from '@angular/common';
import { Component, ComponentRef, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyAccount } from '@notify/interfaces';
import { TailwindFormsModule } from '../../modules/tailwind-forms/tailwind-forms.module';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TailwindFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  @Input({ required: true }) public cf!: ComponentRef<UserFormComponent>;
  @Input() public loading = false;
  @Input() public user: INotifyAccount | null = null;

  public form: FormGroup;

  public validationErrors = {
    required: 'Email is required',
    email: 'Email is invalid',
  };

  constructor() {
    this.form = new FormGroup({
      enabled: new FormControl<boolean>(true),
      email: new FormControl<string>(this.user?.email || '', [
        Validators.email,
        Validators.required,
      ]),
      password: new FormControl<string>('', [Validators.required]),
      role: new FormControl<string>(this.user?.profile?.role || '', []),
    });
  }

  close() {
    this.cf.destroy();
  }
}
