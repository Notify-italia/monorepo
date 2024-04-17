import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import {
  EnumNotifyUserType,
  INotifyAuth,
  INotifyLicense,
  INotifyUser,
} from '@notify/interfaces';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser$ = new BehaviorSubject<INotifyUser | null>(
    this._decodeToken(this.token)
  );

  public get authHeaders() {
    return this._http.genHeaders().headers;
  }

  public get token() {
    return localStorage.getItem(this._tokenPath) || '';
  }

  public get user() {
    return this.currentUser$.value;
  }

  public get activeLicense() {
    const license = this.user?.license as unknown as INotifyLicense;

    if (!license || !license.enabled) {
      return false;
    }

    if (!license.expirationDate && license.enabled) {
      return true;
    }

    return new Date(license.expirationDate) > new Date();
  }

  constructor(
    @Inject('tokenPath') private _tokenPath: string,
    @Inject('userType') private _userType: EnumNotifyUserType,
    private _http: HttpService,
    private _jwt: JwtHelperService
  ) {}

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
   * The signUp function sends a POST request to the server with user data and assigns a token to the
   * user.
   * @param {INotifyAuth} data - INotifyAuth - an interface representing the data required for user
   * signup. It contains properties such as username, email, and password.
   * @returns The `signUp` function is returning an Observable of type `INotifyUser`.
   */
  public signUp(data: INotifyAuth) {
    return this._http.post<INotifyAuth, INotifyUser>(
      `/v1/${this._userType}`,
      data
    );
  }

  /**
   * The `refreshToken` function sends a POST request to refresh the user's token and assigns the new
   * token to the user.
   * @returns The `refreshToken()` method returns an Observable that emits a response object containing
   * a `token` property and an `INotifyUser` object.
   */
  public refreshToken() {
    if (!this.token) {
      return of(null);
    }

    return this._http
      .post<null, INotifyUser>(`/v1/${this._userType}/refresh`, null)
      .pipe(
        tap((user) => this._assignToken(user)),
        catchError(() => {
          this.signOut();
          return of(null);
        })
      );
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

    this.setToken(user.token);
    this.currentUser$.next(this._decodeToken(user.token));
  }

  private _decodeToken(token: string | null): INotifyUser | null {
    if (!token) {
      return null;
    }

    try {
      return this._jwt.decodeToken(token) as INotifyUser;
    } catch (e) {
      return null;
    }
  }

  public setToken(token: string) {
    localStorage.setItem(this._tokenPath, token);
  }
}
