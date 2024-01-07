import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ObservableInput, catchError } from 'rxjs';

@Injectable()
export class HttpService {
  private get token() {
    return localStorage.getItem(this.tokenPath);
  }

  constructor(
    @Inject('apiUrl') private apiUrl: string,
    @Inject('tokenPath') private tokenPath: string,
    private http: HttpClient
  ) {}

  public patch<R, T>(url: string, body: R, params?: Record<string, string>) {
    return this.http
      .patch<T>(`${this.apiUrl}${url}`, body, this._genHeaders(params))
      .pipe(this._unauthorized());
  }

  public post<Request, Resposnse>(
    url: string,
    body: Request,
    params?: Record<string, string>
  ) {
    return this.http
      .post<Resposnse>(`${this.apiUrl}${url}`, body, this._genHeaders(params))
      .pipe(this._unauthorized());
  }

  public get<T>(url: string, params?: Record<string, string>) {
    return this.http
      .get<T>(`${this.apiUrl}${url}`, this._genHeaders(params))
      .pipe(this._unauthorized());
  }

  public delete<T>(url: string, params?: Record<string, string>) {
    return this.http
      .delete<T>(`${this.apiUrl}${url}`, this._genHeaders(params))
      .pipe(this._unauthorized());
  }

  private _genHeaders(params?: Record<string, string>) {
    return {
      params: new HttpParams({ fromObject: params }),
      headers: { Authorization: `Bearer ${this.token}` },
    };
  }

  private _unauthorized<T>() {
    return catchError<T, ObservableInput<T>>((err) => {
      if (err.status !== 401) {
        throw err;
      }

      localStorage.removeItem(this.tokenPath);
      location.reload();

      throw new Error('Unauthorized');
    });
  }
}
