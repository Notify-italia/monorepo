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
import { INotifyAccount, INotifyPartialAgent } from '@notify/interfaces';
import { Subject } from 'rxjs';
import { TailwindFormsModule } from '../../tailwind-forms/tailwind-forms.module';

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

  @Output() public removeRole = new EventEmitter<string>();

  public submitted = new Subject<INotifyPartialAgent>();

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

    const _pwValidators = this.user ? [] : [Validators.required];

    this.form = new FormGroup({
      enabled: new FormControl<boolean>(this.user?.enabled ?? true, []),
      email: new FormControl<string>(this.user?.email || '', [
        Validators.email,
        Validators.required,
      ]),
      password: new FormControl<string>('', _pwValidators),
      role: new FormControl<string>(
        this.user?.profile?.role || '',
        Validators.required
      ),
    });
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
