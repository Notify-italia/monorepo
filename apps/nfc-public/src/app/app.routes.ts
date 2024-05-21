import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'linee-guida',
    loadComponent: () =>
      import('./pages/reindirizzamenti/linee-guida.component').then(
        (m) => m.LineeGuidaComponent
      ),
  },
  {
    path: 'guida-nfc',
    loadComponent: () =>
      import('./pages/reindirizzamenti/guida-nfc.component').then(
        (m) => m.GuidaNFCComponent
      ),
  },
  {
    path: 'guida-aziendale',
    loadComponent: () =>
      import('./pages/reindirizzamenti/guida-aziendale.component').then(
        (m) => m.GuidaAziendaleComponent
      ),
  },
  {
    path: 'guida-app',
    loadComponent: () =>
      import('./pages/reindirizzamenti/guida-app.component').then(
        (m) => m.GuidaAppComponent
      ),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./pages/privacy-policy/privacy-policy.component').then(
        (m) => m.PrivacyPolicyComponent
      ),
  },
  {
    path: 'termini-e-condizioni',
    loadComponent: () =>
      import('./pages/terms-conditions/terms-conditions.component').then(
        (m) => m.TermsConditionsComponent
      ),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];
