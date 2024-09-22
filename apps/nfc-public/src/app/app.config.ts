import { IMAGE_CONFIG } from '@angular/common';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
  HttpService,
  provideEcommerceService,
  providePixelModule,
  provideTailwindToasts,
} from '@notify/ngx-shared';
import { provideClarity } from 'ngx-clarity';
import { ecommerceProducts } from '../assets/shop/_products';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(appRoutes),
    providePixelModule({ pixelId: '1035992114161358', enabled: true }),
    provideHttpClient(withFetch()),
    provideTailwindToasts(),
    {
      provide: HttpService,
      deps: [HttpClient],
      useFactory: (http: HttpClient) =>
        new HttpService(environment.apiUrl, environment.jwtTokenKey, http),
    },
    provideAnimations(),
    // provideToastr(),
    provideClarity({
      enabled: true,
      projectId: 'l2q2lfi4bb',
    }),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true,
      },
    },
    provideEcommerceService(ecommerceProducts),
  ],
};
