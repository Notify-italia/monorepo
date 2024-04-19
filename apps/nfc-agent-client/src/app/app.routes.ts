import { Route } from '@angular/router';
import {
  PageNotFoundComponent,
  authGuard,
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
    path: 'pages',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        data: {
          pageTitle: 'Dashboard',
        },
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
      {
        path: 'profile',
        loadComponent: () =>
          import(
            './pages/profile-management/profile-management.component'
          ).then((m) => m.ProfileManagementComponent),
        data: {
          pageTitle: 'Profilo',
        },
      },
      {
        path: 'colleagues',
        loadComponent: () =>
          import('./pages/colleagues/colleagues.component').then(
            (m) => m.ColleaguesComponent
          ),
        data: {
          pageTitle: 'Colleghi',
        },
      },
      {
        path: 'share',
        loadComponent: () =>
          import('./pages/share-files/share-files.component').then(
            (m) => m.ShareFilesComponent
          ),
        data: {
          pageTitle: 'Condividi Files',
        },
      },
      {
        path: 'notes',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/notes/list/notes.component').then(
                (m) => m.NotesComponent
              ),
            data: {
              pageTitle: 'Note',
            },
          },
          {
            path: 'inspect',
            loadComponent: () =>
              import('./pages/notes/note-manager/note-manager.component').then(
                (m) => m.NoteManagerComponent
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
    data: {
      pageTitle: 'Pagina non trovata',
    },
  },
];
