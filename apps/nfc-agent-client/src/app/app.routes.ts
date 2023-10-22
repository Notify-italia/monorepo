import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'profile',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile-management/profile-management.component').then(
        (m) => m.ProfileManagementComponent
      ),
  },
];
