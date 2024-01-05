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
        path: 'signout',
        loadComponent: () =>
          import('./pages/signout/signout.component').then(
            (m) => m.SignoutComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(
            './pages/profile-management/profile-management.component'
          ).then((m) => m.ProfileManagementComponent),
      },
      {
        path: 'colleagues',
        loadComponent: () =>
          import('./pages/colleagues/colleagues.component').then(
            (m) => m.ColleaguesComponent
          ),
      },
      {
        path: 'notes',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/notes/main/notes.component').then(
                (m) => m.NotesComponent
              ),
          },
          {
            path: 'add',
            loadComponent: () =>
              import('./pages/notes/add-note/add-note.component').then(
                (m) => m.AddNoteComponent
              ),
          },
        ],
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
