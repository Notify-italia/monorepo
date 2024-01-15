import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppError, INotifyAuth } from '@notify/interfaces';
import { AuthService, UtilsService } from '@notify/nfc-app-services';
import { AuthComponent, IAuthConfig } from '@notify/ngx-components';
import { catchError, switchMap, tap } from 'rxjs';

@Component({
  selector: 'notify-signup',
  standalone: true,
  imports: [CommonModule, AuthComponent, RouterModule],
  providers: [UtilsService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  public loading = false;

  public config: IAuthConfig = {
    submitLabel: 'Iscriviti',
    pageSubtitle: 'Dashboard',
    pageTitle: 'Crea un nuovo account',
    isSignup: true,
  };

  constructor(
    private _auth: AuthService,
    private _utilsService: UtilsService
  ) {}

  public signup(data: INotifyAuth) {
    this.loading = true;

    this._auth
      .signUp(data)
      .pipe(
        tap((r) => console.log(r)),
        switchMap(() => this._auth.signIn(data)),
        tap(() => location.reload()),
        catchError((e: AppError) => this._utilsService.errorHandler(e)),
        tap(() => (this.loading = false))
      )
      .subscribe();
  }
}
