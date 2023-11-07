import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideTailwindToasts } from '@notify/nfc-app-components';
import { ApiService, HttpService } from '@notify/nfc-app-services';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    provideTailwindToasts(),
    provideHttpClient(),

    {
      provide: HttpService,
      deps: [HttpClient],
      useFactory: (http: HttpClient) => {
        return new HttpService(environment.apiUrl, http);
      },
    },
    ApiService,
  ],
};
