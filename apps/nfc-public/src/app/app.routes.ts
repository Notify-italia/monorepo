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
      import('./pages/redirect.component').then((m) => m.RedirectComponent),
    data: {
      assetUrl:
        'https://s3-api.vps.notifyapp.it/assets/linee-guida-tessere.pdf',
    },
  },
  {
    path: 'guida-nfc',
    loadComponent: () =>
      import('./pages/redirect.component').then((m) => m.RedirectComponent),
    data: {
      assetUrl: 'https://s3-api.vps.notifyapp.it/assets/Guida_NFC_notify.pdf',
    },
  },
  {
    path: 'guida-aziendale',
    loadComponent: () =>
      import('./pages/redirect.component').then((m) => m.RedirectComponent),
    data: {
      assetUrl: `https://s3-api.vps.notifyapp.it/assets/guida_pannello_aziendale_notify.pdf'`,
    },
  },
  {
    path: 'guida-app',
    loadComponent: () =>
      import('./pages/redirect.component').then((m) => m.RedirectComponent),
    data: {
      assetUrl: `https://s3-api.vps.notifyapp.it/assets/guida_app_notify.pdf`,
    },
  },
  {
    path: 'brochure',
    loadComponent: () =>
      import('./pages/redirect.component').then((m) => m.RedirectComponent),
    data: {
      assetUrl: 'https://s3-api.vps.notifyapp.it/assets/brochure-cliente.pdf',
    },
  },
  {
    path: 'guide',
    loadComponent: () =>
      import('./pages/redirect.component').then((m) => m.RedirectComponent),
    data: {
      assetUrl: 'https://noty.li/p/guide',
    },
  },
  {
    path: 'download',
    loadComponent: () =>
      import('./pages/redirect.component').then((m) => m.RedirectComponent),
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
        loadComponent: () =>
          import('./pages/redirect.component').then((m) => m.RedirectComponent),
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
  // {
  //   path: 'shop',
  //   loadComponent: () =>
  //     import('./pages/shop/shop.component').then((m) => m.ShopComponent),
  // },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];
