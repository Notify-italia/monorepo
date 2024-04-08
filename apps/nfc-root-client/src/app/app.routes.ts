import { Route } from '@angular/router';
import { authKeyGuard, missingAuthKeyGuard } from '@notify/ngx-shared';
import { HomeComponent } from './pages/home/home.component';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/pages',
  },
  {
    path: 'signin',
    canActivate: [missingAuthKeyGuard],
    loadComponent: () =>
      import('./pages/signin/signin.component').then((m) => m.SigninComponent),
    data: {
      pageTitle: 'Accedi',
    },
  },
  {
    path: 'pages',
    component: HomeComponent,
    canActivate: [authKeyGuard],
    children: [
      {
        path: 'customers',
        loadComponent: () =>
          import('./pages/customers/customers.component').then(
            (m) => m.CustomersComponent
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'customer',
        loadComponent: () =>
          import('./pages/inspect-customer/inspect-customer.component').then(
            (m) => m.InspectCustomerComponent
          ),
      },
    ],
  },
  {
    path: 'marketing',
    children: [
      {
        path: 'wallpaper',
        loadComponent: () =>
          import(
            './pages/marketing-wallpaper/marketing-wallpaper.component'
          ).then((m) => m.MarketingWallpaperComponent),
      },
    ],
  },
];
