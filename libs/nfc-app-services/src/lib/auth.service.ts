import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  EnumNotifyUserType,
  INotifyAuth,
  INotifyUser,
} from 'libs/interfaces/src';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser$ = new BehaviorSubject<INotifyUser | null>(
    this._decodeToken(this.token)
  );

  public get token() {
    return localStorage.getItem(this._tokenPath) || '';
  }

  public get user() {
    return this.currentUser$.value;
  }

  constructor(
    @Inject('tokenPath') private _tokenPath: string,
    @Inject('userType') private _userType: EnumNotifyUserType,
    private _http: HttpService,
    private _jwt: JwtHelperService
  ) {
    this.refreshToken()?.subscribe();
  }

  /**
   * The function `signIn` sends a POST request to the server with authentication data and assigns the
   * received token to the user.
   * @param {INotifyAuth} data - The `data` parameter is of type `INotifyAuth`, which is an interface
   * representing the authentication data required for signing in. It likely contains properties such as
   * username and password.
   * @param {EnumNotifyUserType} target - The "target" parameter is an enumeration that specifies the
   * type of user you want to sign in. It could be one of the following values:
   * @returns an Observable of type INotifyUser.
   */
  public signIn(data: INotifyAuth) {
    return this._http
      .post<INotifyAuth, INotifyUser>(`/v1/${this._userType}/signin`, data)
      .pipe(tap((user) => this._assignToken(user)));
  }

  /**
   * The `refreshToken` function sends a POST request to refresh the user's token and assigns the new
   * token to the user.
   * @returns The `refreshToken()` method returns an Observable that emits a response object containing
   * a `token` property and an `INotifyUser` object.
   */
  public refreshToken() {
    if (!this.token) {
      return;
    }

    return this._http
      .post<null, INotifyUser>(`/v1/${this._userType}/refresh`, null)
      .pipe(tap((user) => this._assignToken(user)));
  }

  /**
   * The signOut function removes the token from local storage, sets the current user to null, and
   * reloads the page.
   */
  public signOut() {
    localStorage.removeItem(this._tokenPath);
    this.currentUser$.next(null);
    location.reload();
  }

  private _assignToken(user: INotifyUser) {
    if (!user.token) {
      throw new Error('Missing token');
    }

    this._setToken(user.token);
    this.currentUser$.next(this._decodeToken(user.token));
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
