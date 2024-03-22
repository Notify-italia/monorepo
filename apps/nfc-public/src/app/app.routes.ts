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
      import('./pages/linee-guida/linee-guida.component').then(
        (m) => m.LineeGuidaComponent
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
