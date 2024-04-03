import { CommonModule } from '@angular/common';
import { Component, ComponentRef } from '@angular/core';
import { AppError } from '@notify/interfaces';
import {
  AuthService,
  AvatarComponent,
  CompanyService,
  EnumDicebearAvatarStyles,
  IUserFormHiddenFields,
  IUserFormPasswordFieldConfig,
  PageHeaderComponent,
  UserFormComponent,
  UserFormFactory,
  UtilsService,
} from '@notify/ngx-shared';
import { ToastrService } from 'ngx-toastr';
import { OperatorFunction, catchError, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, AvatarComponent],
  providers: [UserFormFactory, CompanyService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  public dicebearStyles = EnumDicebearAvatarStyles;
  public get user() {
    return this._authService.user;
  }

  constructor(
    private _authService: AuthService,
    private _userForm: UserFormFactory,
    private _companyService: CompanyService,
    private _toastr: ToastrService,
    private _utilsService: UtilsService
  ) {}

  public editEmail() {
    if (!this.user) {
      return;
    }

    const ref = this._userForm.create(
      this.user,
      [],
      this._userFormHiddenFields('email')
    );

    ref.instance.submitted
      .pipe(
        takeUntil(ref.instance.destroyed$),
        switchMap((_u) => {
          ref.instance.loading = true;

          return this._companyService.patchCompany({
            email: _u.email,
          });
        }),
        ...(this._httpCallFlow(ref) as [OperatorFunction<unknown, unknown>])
      )
      .subscribe();
  }

  public editPassword() {
    if (!this.user) {
      return;
    }

    const ref = this._userForm.create(
      this.user,
      [],
      this._userFormHiddenFields('password'),
      {
        required: true,
        helpText:
          'deve contenere almeno 6 caratteri e non può essere uguale alla password attuale',
      } as IUserFormPasswordFieldConfig
    );

    ref.instance.submitted
      .pipe(
        takeUntil(ref.instance.destroyed$),
        switchMap((_u) => {
          ref.instance.loading = true;

          return this._companyService.patchCompany({
            password: _u.password,
          });
        }),
        ...(this._httpCallFlow(ref) as [OperatorFunction<unknown, unknown>])
      )
      .subscribe();
  }

  private _userFormHiddenFields(excluded: string) {
    const allFields: IUserFormHiddenFields = [
      'email',
      'password',
      'role',
      'enabled',
      'feedbackEnabled',
    ];

    return allFields.filter((f) => f !== excluded);
  }

  private _httpCallFlow(
    ref: ComponentRef<UserFormComponent>
  ): OperatorFunction<unknown, unknown>[] {
    return [
      switchMap(() => this._authService.refreshToken()),
      tap(() => {
        this._toastr.success('Utente salvato, eseguo log out', 'OK');
        ref.instance.loading = false;
        ref.instance.close();
        setTimeout(() => {
          this._authService.signOut();
        }, 1000);
      }),
      catchError((error: AppError, c) => {
        this._utilsService.errorHandler(error);
        ref.instance.loading = false;

        return c;
      }),
    ];
  }
}
