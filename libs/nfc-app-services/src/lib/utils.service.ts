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
}
