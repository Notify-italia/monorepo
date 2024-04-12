import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RootService } from '../services';

export const missingAuthKeyGuard: CanActivateFn = () => {
  const authService = inject(RootService);
  const router = inject(Router);

  if (authService.authKey) {
    router.navigate(['/pages']);
    return false;
  }

  return true;
};
