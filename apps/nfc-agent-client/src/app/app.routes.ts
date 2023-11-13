import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/pages',
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./pages/signin/signin.component').then((m) => m.SigninComponent),
  },
  {
    path: 'pages',
    component: HomeComponent,
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import(
            './pages/profile-management/profile-management.component'
          ).then((m) => m.ProfileManagementComponent),
      },
    ],
  },
];
