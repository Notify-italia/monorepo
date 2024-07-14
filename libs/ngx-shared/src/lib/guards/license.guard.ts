import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { INotifyLicense } from '@notify/interfaces';
import { AuthService } from '../services/auth.service';

export const licenseGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const license = authService.currentUser$.value
    ?.license as unknown as INotifyLicense;

  if (license && !license.expirationDate && license.enabled) {
    return true;
  }

  if (
    !license ||
    !license.enabled ||
    new Date(license.expirationDate) < new Date()
  ) {
    router.navigate(['/pages/settings']);
    return false;
  }

  return true;
};
