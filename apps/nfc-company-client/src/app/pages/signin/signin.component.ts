import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppError, INotifyAuth } from '@notify/interfaces';
import { AuthService, UtilsService } from '@notify/nfc-app-services';
import { AuthComponent } from '@notify/ngx-components';
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
    pageSubtitle: 'Dashboard',
    pageTitle: "Effettua l'accesso",
  };

  constructor(
    private _auth: AuthService,
    private _utilsService: UtilsService
  ) {}

  public signin(data: INotifyAuth) {
    this.loading = true;

    this._auth
      .signIn(data)
      .pipe(
        tap(() => {
          location.reload();
        }),
        catchError((e: AppError) => this._utilsService.errorHandler(e)),
        tap(() => (this.loading = false))
      )
      .subscribe();
  }
}
