import { Injectable } from '@angular/core';

const AUTH_LS_KEY = 'auth';

@Injectable({
  providedIn: 'root',
})
export class RootService {
  public get authKey() {
    return localStorage.getItem(AUTH_LS_KEY);
  }

  public setAuthentication(data: string) {
    localStorage.setItem(AUTH_LS_KEY, data);
  }
}
