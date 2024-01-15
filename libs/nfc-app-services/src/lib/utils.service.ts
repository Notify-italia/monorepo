import { Injectable } from '@angular/core';
import { AppError } from '@notify/interfaces';
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
    return of(null);
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

  private _arrayToObject<T>(array: T[]) {
    return array.reduce((acc: { [key: number]: unknown }, curr, index) => {
      acc[index] = curr;
      return acc;
    }, {});
  }
}
