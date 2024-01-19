import { registerLocaleData } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import it from '@angular/common/locales/it';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import {
  HttpService,
  ProfileService,
  SocketService,
} from '@notify/nfc-app-services';
import { provideTailwindToasts } from '@notify/ngx-components';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    provideAnimations(),
    provideTailwindToasts(),
    {
      provide: HttpService,
      deps: [HttpClient],
      useFactory: (http: HttpClient) => {
        return new HttpService(environment.apiUrl, '', http);
      },
    },
    {
      provide: SocketService,
      deps: [DeviceDetectorService],
      useFactory: (detector: DeviceDetectorService) =>
        new SocketService(environment.socketUrl, detector),
    },
    ProfileService,
    DeviceDetectorService,
  ],
};

registerLocaleData(it);
