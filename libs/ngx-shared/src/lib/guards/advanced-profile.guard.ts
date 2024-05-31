import { CanActivateFn } from '@angular/router';

export const advancedProfileGuard: CanActivateFn = () => {
  // const authService = inject(AuthService);
  // const router = inject(Router);

  // if (authService.user?.advancedProfile) {
  //   router.navigate(['/pages/profile/editor']);
  //   return false;

  return true;
};
