import { Route } from '@angular/router';
import { authGuard, licenseGuard, signInGuard } from '@notify/nfc-app-services';
import { PageNotFoundComponent } from '@notify/ngx-components';
import { HomeComponent } from './pages/home/home.component';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/pages',
  },
  {
    path: 'signin',
    canActivate: [signInGuard],
    loadComponent: () =>
      import('./pages/signin/signin.component').then((m) => m.SigninComponent),
  },
  {
    path: 'signup',
    canActivate: [signInGuard],
    loadComponent: () =>
      import('./pages/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'pages',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'accounts',
      },
      {
        path: 'accounts',
        canActivate: [licenseGuard],
        loadComponent: () =>
          import('./pages/accounts/accounts.component').then(
            (m) => m.AccountsComponent
          ),
      },
      {
        path: 'license',
        loadComponent: () =>
          import('./pages/license/license.component').then(
            (m) => m.LicenseComponent
          ),
      },
      {
        path: 'profile',
        canActivate: [licenseGuard],
        loadComponent: () =>
          import(
            './pages/profile-management/profile-management.component'
          ).then((m) => m.ProfileManagementComponent),
      },
      {
        path: 'signout',
        canActivate: [licenseGuard],
        loadComponent: () =>
          import('./pages/signout/signout.component').then(
            (m) => m.SignoutComponent
          ),
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
  },
];
