import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  EnumNotifyUserType,
  INotifyAuth,
  INotifyUser,
} from '@notify/nfc-interfaces';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser$ = new BehaviorSubject<INotifyUser | null>(
    this._decodeToken(localStorage.getItem(this._tokenPath))
  );

  constructor(
    @Inject('tokenPath') private _tokenPath: string,
    private _http: HttpService,
    private _jwt: JwtHelperService
  ) {}

  public signIn(data: INotifyAuth, target: EnumNotifyUserType) {
    return this._http
      .post<INotifyAuth, INotifyUser>(`/v1/${target}/signin`, data)
      .pipe(
        tap((user) => {
          if (!user.token) {
            throw new Error('Missing token');
          }

          this._setToken(user.token);
          this.currentUser$.next(this._decodeToken(user.token));
        })
      );
  }

  public signOut() {
    localStorage.removeItem(this._tokenPath);
    this.currentUser$.next(null);
    location.reload();
  }

  private _decodeToken(token: string | null): INotifyUser | null {
    if (!token) {
      return null;
    }

    return this._jwt.decodeToken(token) as INotifyUser;
  }

  private _setToken(token: string) {
    localStorage.setItem(this._tokenPath, token);
  }
}
