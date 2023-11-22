import { Route } from '@angular/router';
import { authGuard, signInGuard } from '@notify/nfc-app-services';
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
    path: 'pages',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile',
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import('./pages/accounts/accounts.component').then(
            (m) => m.AccountsComponent
          ),
      },
      {
        path: 'signout',
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
