import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'builder',
    loadComponent: () =>
      import('./pages/card-builder/card-builder.component').then(
        (m) => m.CardBuilderComponent
      ),
  },
  {
    path: 'linee-guida',
    loadComponent: () =>
      import('./pages/linee-guida/linee-guida.component').then(
        (m) => m.LineeGuidaComponent
      ),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];
