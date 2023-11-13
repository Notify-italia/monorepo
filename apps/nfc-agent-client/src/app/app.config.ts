import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideTailwindToasts } from '@notify/nfc-app-components';
import {
  HttpService,
  ProfileService,
  UtilsService,
} from '@notify/nfc-app-services';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

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
    UtilsService,
    {
      provide: HttpService,
      deps: [HttpClient],
      useFactory: (http: HttpClient) => {
        return new HttpService(environment.apiUrl, http);
      },
    },
    ProfileService,
  ],
};
