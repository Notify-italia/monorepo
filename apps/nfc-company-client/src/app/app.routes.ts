import { Route } from '@angular/router';
import {
  PageNotFoundComponent,
  authGuard,
  licenseGuard,
  signInGuard,
} from '@notify/ngx-shared';
import { HomeComponent } from './pages/home/home.component';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/pages',
  },
  {
    path: 'signin',
    children: [
      {
        path: '',
        canActivate: [signInGuard],
        loadComponent: () =>
          import('./pages/signin/signin.component').then(
            (m) => m.SigninComponent
          ),
        data: {
          pageTitle: 'Accedi',
        },
      },
      {
        path: 'force',
        loadComponent: () =>
          import('./pages/signin/signin.component').then(
            (m) => m.SigninComponent
          ),
        data: {
          pageTitle: 'Accedi',
        },
      },
    ],
  },
  {
    path: 'signup',
    canActivate: [signInGuard],
    loadComponent: () =>
      import('./pages/signup/signup.component').then((m) => m.SignupComponent),
    data: {
      pageTitle: 'Registrati',
    },
  },
  {
    path: 'password',
    canActivate: [signInGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'recover',
      },
      {
        path: 'recover',
        loadComponent: () =>
          import('./pages/recover-password/recover-password.component').then(
            (m) => m.RecoverPasswordComponent
          ),
        data: {
          pageTitle: 'Recupera password',
        },
      },
      {
        path: 'update',
        loadComponent: () =>
          import('./pages/update-password/update-password.component').then(
            (m) => m.UpdatePasswordComponent
          ),
        data: {
          pageTitle: 'Aggiorna password',
        },
      },
    ],
  },
  {
    path: 'pages',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'users',
      },
      {
        path: 'users',
        canActivate: [licenseGuard],
        loadComponent: () =>
          import('./pages/accounts/accounts.component').then(
            (m) => m.AccountsComponent
          ),
        data: {
          pageTitle: 'Utenti',
        },
      },
      {
        path: 'license',
        loadComponent: () =>
          import('./pages/license/license.component').then(
            (m) => m.LicenseComponent
          ),
        data: {
          pageTitle: 'Licenza',
        },
      },
      {
        path: 'profile',
        canActivate: [licenseGuard],
        loadComponent: () =>
          import(
            './pages/profile-management/profile-management.component'
          ).then((m) => m.ProfileManagementComponent),
        data: {
          pageTitle: 'Profilo',
        },
      },
      {
        path: 'settings',
        canActivate: [licenseGuard],
        loadComponent: () =>
          import('./pages/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
        data: {
          pageTitle: 'Impostazioni',
        },
      },

      {
        path: 'analytics',
        canActivate: [licenseGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'dashboard',
          },
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./pages/analytics/analytics.component').then(
                (m) => m.AnalyticsComponent
              ),
            data: {
              pageTitle: 'Analytics',
            },
          },
          {
            path: 'detail',
            loadComponent: () =>
              import(
                './pages/analytics-detail/analytics-detail.component'
              ).then((m) => m.AnalyticsDetailComponent),
          },
        ],
      },
      {
        path: 'signout',
        loadComponent: () =>
          import('./pages/signout/signout.component').then(
            (m) => m.SignoutComponent
          ),
        data: {
          pageTitle: 'Esci',
        },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: PageNotFoundComponent,
    data: {
      pageTitle: 'Pagina non trovata',
    },
  },
];
