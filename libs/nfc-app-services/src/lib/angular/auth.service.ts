import { Injectable } from '@angular/core';
import {
  EnumNotifyAccountType,
  INotifyAcount,
  INotifyAuth,
} from '@notify/nfc-interfaces';
import { HttpService } from './http.service';

@Injectable()
export class AuthService {
  constructor(private _http: HttpService) {}

  public signIn(data: INotifyAuth, target: EnumNotifyAccountType) {
    return this._http.post<INotifyAuth, INotifyAcount[typeof target]>(
      `/v1/${target}/signin`,
      data
    );
  }
}
