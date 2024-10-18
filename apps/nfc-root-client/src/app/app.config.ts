import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import {
  HttpServiceTokenType,
  provideHttpService,
  provideRootService,
  provideStripeService,
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
    provideAnimations(),
    provideStripeService(),
  ],
};
