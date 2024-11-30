import { Route } from '@angular/router';
import { RedirectComponent } from '@notify/ngx-shared';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'linee-guida',
    loadComponent: () => RedirectComponent,
    data: {
      assetUrl:
        'https://s3-api.vps.notifyapp.it/assets/linee-guida-tessere.pdf',
    },
  },
  {
    path: 'guida-nfc',
    loadComponent: () => RedirectComponent,
    data: {
      assetUrl: 'https://s3-api.vps.notifyapp.it/assets/Guida_NFC_notify.pdf',
    },
  },
  {
    path: 'guida-aziendale',
    loadComponent: () => RedirectComponent,
    data: {
      assetUrl: `https://s3-api.vps.notifyapp.it/assets/guida_pannello_aziendale_notify.pdf'`,
    },
  },
  {
    path: 'guida-app',
    loadComponent: () => RedirectComponent,
    data: {
      assetUrl: `https://s3-api.vps.notifyapp.it/assets/guida_app_notify.pdf`,
    },
  },
  {
    path: 'brochure',
    loadComponent: () => RedirectComponent,
    data: {
      assetUrl: 'https://s3-api.vps.notifyapp.it/assets/brochure-cliente.pdf',
    },
  },
  {
    path: 'guide',
    loadComponent: () => RedirectComponent,
    data: {
      assetUrl: 'https://noty.li/p/guide',
    },
  },
  {
    path: 'download',
    loadComponent: () => RedirectComponent,
    data: {
      assetUrl: 'https://noty.li/p/downloads',
    },
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./pages/privacy-policy/privacy-policy.component').then(
        (m) => m.PrivacyPolicyComponent
      ),
  },
  {
    path: 'thirdparties',
    children: [
      {
        path: 'privacy',
        loadComponent: () => RedirectComponent,
        data: {
          assetUrl:
            'https://s3-api.vps.notifyapp.it/assets/thirdparties-privacy.pdf',
        },
      },
    ],
  },
  {
    path: 'termini-e-condizioni',
    loadComponent: () =>
      import('./pages/terms-conditions/terms-conditions.component').then(
        (m) => m.TermsConditionsComponent
      ),
  },
  {
    path: 'checkout-success',
    loadComponent: () =>
      import('./pages/checkout-success/checkout-success.component').then(
        (m) => m.CheckoutSuccessComponent
      ),
  },
  {
    path: 'provalo',
    loadComponent: () =>
      import('./pages/try-it/try-it.component').then((m) => m.TryItComponent),
  },

  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];
