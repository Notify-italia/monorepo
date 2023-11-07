import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { INotifyProfile } from '@notify/nfc-interfaces';

@Injectable()
export class ApiService {
  constructor(
    @Inject('apiUrl') private apiUrl: string,
    private http: HttpClient
  ) {}

  public getProfile(id: string) {
    return this._get<INotifyProfile>(
      `/v1/profile`,
      new HttpParams({ fromObject: { id } })
    );
  }

  private _patch<R, T>(url: string, body: R, headers?: Record<string, string>) {
    return this.http.patch<T>(`${this.apiUrl}${url}`, body, { headers });
  }

  private _post<R, T>(url: string, body: R, headers?: Record<string, string>) {
    return this.http.post<T>(`${this.apiUrl}${url}`, body, { headers });
  }

  private _get<T>(url: string, httpParams?: HttpParams) {
    return this.http.get<T>(`${this.apiUrl}${url}`, { params: httpParams });
  }
}
