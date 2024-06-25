import { Routes } from '@angular/router';

// Import your components here

// Define your routes here
export const leadModuleRoutes: Routes = [
  {
    path: 'leads',
    children: [
      {
        path: '',

        loadComponent: () =>
          import('./leads-list/leads-list.component').then(
            (m) => m.LeadsListComponent
          ),
        data: {
          pageTitle: 'Contatti',
        },
      },
    ],
  },
];
