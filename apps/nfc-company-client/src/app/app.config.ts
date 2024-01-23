import { registerLocaleData } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import it from '@angular/common/locales/it';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withRouterConfig } from '@angular/router';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { EnumNotifyUserType } from '@notify/interfaces';
import {
  AuthService,
  HttpService,
  ProfileService,
  UtilsService,
} from '@notify/nfc-app-services';
import { provideTailwindToasts } from '@notify/ngx-components';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export function tokenGetter() {
  return localStorage?.getItem(environment.jwtTokenKey) || '';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      })
    ),
    provideAnimations(),
    provideTailwindToasts(),
    provideHttpClient(),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
        },
      })
    ),
    UtilsService,
    ProfileService,
    {
      provide: HttpService,
      deps: [HttpClient],
      useFactory: (http: HttpClient) =>
        new HttpService(environment.apiUrl, environment.jwtTokenKey, http),
    },
    {
      provide: AuthService,
      deps: [HttpService, JwtHelperService],
      useFactory: (http: HttpService, jwt: JwtHelperService) =>
        new AuthService(
          environment.jwtTokenKey,
          EnumNotifyUserType.Company,
          http,
          jwt
        ),
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true,
    },
  ],
};

function initializeApp(auth: AuthService) {
  return () => auth.refreshToken();
}
registerLocaleData(it);
