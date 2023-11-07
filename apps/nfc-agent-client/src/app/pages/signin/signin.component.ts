import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthComponent } from '@notify/nfc-app-components';
import { AuthService } from '@notify/nfc-app-services';
import {
  AppError,
  EnumNotifyAccountType,
  INotifyAuth,
} from '@notify/nfc-interfaces';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'notify-signin',
  standalone: true,
  imports: [CommonModule, AuthComponent],
  providers: [AuthService],
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
      .signIn(data, EnumNotifyAccountType.agent)
      .pipe(
        tap((r) => {
          this.loading = false;
          console.log(r);

          //TODO salva token in local storage e reindirizza
        }),
        catchError((e: AppError) => {
          this.loading = false;
          this._toastr.error(e.error.message);
          throw e;
        })
      )
      .subscribe();
  }
}
