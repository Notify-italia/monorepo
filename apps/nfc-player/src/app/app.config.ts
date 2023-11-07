import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { ApiService } from '@notify/nfc-app-services';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    {
      provide: ApiService,
      deps: [HttpClient],
      useFactory: (http: HttpClient) => {
        return new ApiService(environment.apiUrl, http);
      },
    },
  ],
};
