import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppError, INotifyAuth } from '@notify/interfaces';
import { AuthComponent, AuthService, UtilsService } from '@notify/ngx-shared';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'notify-signin',
  standalone: true,
  imports: [CommonModule, AuthComponent],
  providers: [UtilsService],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  public loading = false;

  public config = {
    submitLabel: "Entra nell'app",
    pageSubtitle: '',
    pageTitle: "Effettua l'accesso",
    signupRoute: '',
    forgotPasswordRoute: '',
  };

  constructor(
    private _auth: AuthService,
    private _utilsService: UtilsService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    const token = this._activatedRoute.snapshot.queryParamMap.get('t');

    if (!token) {
      return;
    }

    this._auth.setToken(token);
    this._router.navigate(['/']);
    setTimeout(() => {
      location.reload();
    }, 100);
  }

  public signin(data: INotifyAuth) {
    this.loading = true;

    this._auth
      .signIn(data)
      .pipe(
        tap(() => location.reload()),
        catchError((err: AppError) => {
          this.loading = false;
          return this._utilsService.errorHandler(err);
        })
      )
      .subscribe();
  }
}
