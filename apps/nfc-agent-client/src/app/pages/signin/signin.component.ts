import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthComponent } from '@notify/nfc-app-components';
import { AuthService } from '@notify/nfc-app-services';
import {
  AppError,
  EnumNotifyUserType,
  INotifyAuth,
} from '@notify/nfc-interfaces';
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
    pageTitle: "Effettua l'accesso",
  };

  constructor(private _auth: AuthService, private _toastr: ToastrService) {}

  public signin(data: INotifyAuth) {
    this.loading = true;

    this._auth
      .signIn(data, EnumNotifyUserType.Agent)
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
