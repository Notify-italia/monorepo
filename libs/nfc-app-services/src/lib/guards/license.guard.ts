import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { INotifyLicense } from '@notify/interfaces';
import { AuthService } from '../auth.service';

export const licenseGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const license = authService.currentUser$.value
    ?.license as unknown as INotifyLicense;

  if (!license || new Date(license.expirationDate) < new Date()) {
    router.navigate(['/pages/license']);
    return false;
  }

  return true;
};
