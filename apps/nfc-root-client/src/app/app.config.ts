import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import {
  HttpServiceTokenType,
  provideHttpService,
  provideRootService,
  provideTailwindToasts,
} from '@notify/ngx-shared';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpService(
      environment.apiUrl,
      environment.apiKeyKey,
      HttpServiceTokenType.XApiKey
    ),
    provideRootService(environment.apiKeyKey),
    provideTailwindToasts(),
  ],
};
