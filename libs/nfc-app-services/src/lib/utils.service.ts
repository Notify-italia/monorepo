import { Injectable } from '@angular/core';
import { AppError } from '@notify/interfaces';
import { format, isValid } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

@Injectable()
export class UtilsService {
  constructor(private _toastr: ToastrService) {}

  public stringToArrayBuffer(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);

    const ab = new ArrayBuffer(byteString.length);
    const dw = new DataView(ab);

    for (let i = 0; i < byteString.length; i++) {
      dw.setUint8(i, byteString.charCodeAt(i));
    }

    return [ab];
  }

  public errorHandler(error: AppError) {
    this._toastr.error(
      error?.error?.errors?.[0]?.message || 'Si è verificato un errore',
      'Errore'
    );
    return of([]);
  }

  public deepFindFields(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj: { [key: string]: any | any[] },
    path: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any[] {
    const paths = path.split('.');
    let current = obj;
    const result: unknown[] = [];

    for (const p of paths) {
      if (Array.isArray(current)) {
        for (const item of current) {
          result.push(...this.deepFindFields(item, p));
        }
        return result;
      }
      if (current[p] === undefined) {
        return [];
      }
      current = current[p];
    }

    result.push(current);
    return result;
  }

  public normalizeValue(value: unknown) {
    if (value === null || value === undefined) {
      return '';
    }

    //if the value is an array, stringify it
    if (Array.isArray(value) || typeof value === 'object') {
      return JSON.stringify(value);
    }

    //if the value is a valid object, stringify it
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    //if the value is a valid date object, stringify it and format it as dd/MM/yyyy
    const pDate = new Date(value as string);
    if (isValid(pDate)) {
      console.log('date is valid');
      return format(pDate, 'dd/MM/yyyy');
    }

    return (value as string)?.toLowerCase();
  }
}
