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
      {
        path: 'inspect',
        loadComponent: () =>
          import('./lead-detail/lead-detail.component').then(
            (m) => m.LeadDetailComponent
          ),
      },
    ],
  },
];
