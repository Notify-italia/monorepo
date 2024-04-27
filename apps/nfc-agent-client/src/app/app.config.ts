import { registerLocaleData } from '@angular/common';
import it from '@angular/common/locales/it';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withRouterConfig } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { EnumNotifyUserType } from '@notify/interfaces';
import {
  AuthService,
  ProfileService,
  SocketService,
  UtilsService,
  provideAuthService,
  provideHttpService,
  providePageTitleService,
  provideTailwindToasts,
} from '@notify/ngx-shared';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export function tokenGetter() {
  return localStorage.getItem(environment.jwtTokenKey) || '';
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
    providePageTitleService('Notify'),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
        },
      })
    ),
    UtilsService,
    ProfileService,
    provideHttpService(environment.apiUrl, environment.jwtTokenKey),
    provideAuthService({
      jwtTokenKey: environment.jwtTokenKey,
      userType: EnumNotifyUserType.Agent,
    }),
    {
      provide: SocketService,
      deps: [DeviceDetectorService],
      useFactory: (detector: DeviceDetectorService) =>
        new SocketService(
          environment.socketUrl,
          environment.socketIdKey,
          detector
        ),
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true,
    },
    DeviceDetectorService,
  ],
};

function initializeApp(auth: AuthService) {
  return () => auth.refreshToken();
}
registerLocaleData(it);
