import { Route } from '@angular/router';

export const appRoutes: Route[] = [
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
