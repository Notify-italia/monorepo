import { AbstractControl } from '@angular/forms';

const regex = {
  mobile: /^(\+39)?\s?3\d{2}[.\s]?\d{6,7}$/,
  landline: /^(\+39)?\s?(0\d{1,4})?[.\s]?(\d{6,7})$/,
};

export function itPhoneNumberValidators(
  control: AbstractControl<string>
): { [key: string]: boolean } | null {
  if (!control.dirty || !control.value) {
    return null;
  }

  const val = control.value.replace(/\s/g, '');

  const isMobile = regex.mobile.test(val);
  const isLandline = regex.landline.test(val);
  const isNumeroVerde = val.startsWith('800') || val.startsWith('803');

  return isMobile || isLandline || isNumeroVerde
    ? null
    : { itPhoneNumber: true };
}
