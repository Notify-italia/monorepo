import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { HttpService, providePixelModule } from '@notify/nfc-app-services';
import { provideToastr } from 'ngx-toastr';
import { environment } from '../environments/environment.prod';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    providePixelModule({ pixelId: '1105803970565876', enabled: true }),
    {
      provide: HttpService,
      deps: [HttpClient],
      useFactory: (http: HttpClient) =>
        new HttpService(environment.apiUrl, environment.jwtTokenKey, http),
    },
    provideAnimations(),
    // provideTailwindToasts(),
    provideToastr(),
  ],
};
