import { CanActivateFn } from '@angular/router';

export const redirectGuard: CanActivateFn = (route, state) => {
  const { url } = route.data;

  if (url) {
    window.location.href = url;
    return false;
  }
  return true;
};
