import {
  HttpClient,
  HttpParams,
  provideHttpClient,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ObservableInput, catchError } from 'rxjs';

export enum HttpServiceTokenType {
  Bearer = 'bearer',
  XApiKey = 'x-api-key',
}

@Injectable()
export class HttpService {
  private get token() {
    return localStorage.getItem(this.tokenPath);
  }

  constructor(
    @Inject('apiUrl') private apiUrl: string,
    @Inject('tokenPath') private tokenPath: string,
    private http: HttpClient,
    @Inject('tokenType')
    private tokenType: HttpServiceTokenType = HttpServiceTokenType.Bearer
  ) {}

  public patch<Req, Res>(
    url: string,
    body: Req,
    params?: Record<string, string>
  ) {
    return this.http
      .patch<Res>(`${this.apiUrl}${url}`, body, this._genHeaders(params))
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

  public get<T>(url: string, params?: Record<string, unknown>) {
    return this.http
      .get<T>(`${this.apiUrl}${url}`, this._genHeaders(params))
      .pipe(this._unauthorized());
  }

  public delete<T>(url: string, params?: Record<string, string>) {
    return this.http
      .delete<T>(`${this.apiUrl}${url}`, this._genHeaders(params))
      .pipe(this._unauthorized());
  }

  private _genHeaders(params?: Record<string, unknown>) {
    const headers: { [key: string]: string } =
      this.tokenType === 'x-api-key'
        ? { 'x-api-key': this.token || '' }
        : { Authorization: `Bearer ${this.token}` };

    return {
      params: new HttpParams({ fromObject: params as Record<string, string> }),
      headers,
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

export const provideHttpService = (
  apiUrl: string,
  tokenPath: string,
  tokenType?: HttpServiceTokenType
) => [
  provideHttpClient(),
  {
    provide: HttpService,
    deps: [HttpClient],
    useFactory: (http: HttpClient) =>
      new HttpService(apiUrl, tokenPath, http, tokenType),
  },
];
