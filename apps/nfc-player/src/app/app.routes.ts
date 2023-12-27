import { Route } from '@angular/router';
import { PageNotFoundComponent } from '@notify/ngx-components';
import { ProfileComponent } from './pages/profile/profile.component';

export const appRoutes: Route[] = [
  {
    path: 'profile',
    component: ProfileComponent,
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
      noHomeRedirect: true,
    },
  },
];
