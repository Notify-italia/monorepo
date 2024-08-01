import { isPlatformBrowser } from '@angular/common';
import {
  HttpClient,
  HttpParams,
  provideHttpClient,
} from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UnknownType } from '@notify/interfaces';
import { catchError, ObservableInput, retry, timeout } from 'rxjs';

export enum HttpServiceTokenType {
  Bearer = 'bearer',
  XApiKey = 'x-api-key',
}

@Injectable()
export class HttpService {
  private _platformID = inject(PLATFORM_ID);
  public get apiBaseUrl(): string {
    return this.apiUrl;
  }

  private get token() {
    if (!isPlatformBrowser(this._platformID)) {
      return 'none';
    }
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
      .patch<Res>(`${this.apiUrl}${url}`, body, this.genHeaders(params))
      .pipe(this._unauthorized());
  }

  public post<Request, Resposnse>(
    url: string,
    body: Request,
    params?: Record<string, string>
  ) {
    return this.http
      .post<Resposnse>(`${this.apiUrl}${url}`, body, this.genHeaders(params))
      .pipe(this._unauthorized());
  }

  public get<T>(url: string, params?: UnknownType) {
    return this.http
      .get<T>(`${this.apiUrl}${url}`, this.genHeaders(params))
      .pipe(this._unauthorized(), timeout(10000), retry(2));
  }

  public delete<T>(url: string, params?: Record<string, string | undefined>) {
    return this.http
      .delete<T>(`${this.apiUrl}${url}`, this.genHeaders(params))
      .pipe(this._unauthorized());
  }

  public genHeaders(params?: UnknownType) {
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
