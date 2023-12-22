import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppError, INotifyAuth } from '@notify/interfaces';
import { AuthService } from '@notify/nfc-app-services';
import { AuthComponent } from '@notify/ngx-components';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'notify-signin',
  standalone: true,
  imports: [CommonModule, AuthComponent],
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

  constructor(private _auth: AuthService, private _toastr: ToastrService) {}

  public signin(data: INotifyAuth) {
    this.loading = true;

    this._auth
      .signIn(data)
      .pipe(
        tap(() => {
          this.loading = false;
          location.reload();
        }),
        catchError((e: AppError) => {
          this.loading = false;
          this._toastr.error(e.error.errors[0].message);
          throw e;
        })
      )
      .subscribe();
  }
}
