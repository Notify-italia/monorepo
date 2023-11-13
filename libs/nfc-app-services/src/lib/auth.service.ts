import { Injectable } from '@angular/core';
import {
  EnumNotifyUserType,
  INotifyAccount,
  INotifyAuth,
} from '@notify/nfc-interfaces';
import { ReplaySubject } from 'rxjs';
import { HttpService } from './http.service';

@Injectable()
export class AuthService {
  public currentUser$ = new ReplaySubject<INotifyAccount>(1);

  constructor(private _http: HttpService) {}

  public signIn(data: INotifyAuth, target: EnumNotifyUserType) {
    return this._http.post<INotifyAuth, INotifyAccount[typeof target]>(
      `/v1/${target}/signin`,
      data
    );
  }
}
