import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class HttpService {
  constructor(
    @Inject('apiUrl') private apiUrl: string,
    private http: HttpClient
  ) {}

  public patch<R, T>(url: string, body: R, params?: Record<string, string>) {
    return this.http.patch<T>(`${this.apiUrl}${url}`, body, {
      params: new HttpParams({ fromObject: params }),
    });
  }

  public post<R, T>(url: string, body: R, params?: Record<string, string>) {
    return this.http.post<T>(`${this.apiUrl}${url}`, body, {
      params: new HttpParams({ fromObject: params }),
    });
  }

  public get<T>(url: string, params?: Record<string, string>) {
    return this.http.get<T>(`${this.apiUrl}${url}`, {
      params: new HttpParams({ fromObject: params }),
    });
  }
}
