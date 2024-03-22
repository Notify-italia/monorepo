import { AbstractControl } from '@angular/forms';

export const passwordMatchValidator = (control: AbstractControl) => {
  const parent = control.parent;
  const password = parent?.get('password')?.value;
  const confirmPassword = parent?.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    return { passwordMatch: true };
  }

  return null;
};
