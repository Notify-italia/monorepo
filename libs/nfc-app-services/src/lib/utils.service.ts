import { Injectable } from '@angular/core';
import { AppError } from '@notify/interfaces';
import { format } from 'date-fns';
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

  public errorHandler<T>(error: AppError, returnValue?: T) {
    this._toastr.error(
      error?.error?.errors?.[0]?.message || 'Si è verificato un errore',
      'Errore'
    );
    return of((returnValue || []) as T);
  }

  /**
   *La funzione `deepSearchKey` cerca ricorsivamente i campi in un oggetto in base a un determinato percorso.
   *@param obj -Un oggetto che contiene coppie chiave-valore, dove le chiavi sono stringhe e i valori
   *può essere di qualsiasi tipo o un array di qualsiasi tipo.
   *@param {string} path -Il parametro `path` è una stringa che rappresenta il percorso dei campi
   *che vuoi trovare nell'oggetto `obj`. Il percorso dovrebbe essere in notazione punto, dove ogni segmento
   *rappresenta una proprietà nidificata o un indice di array. Ad esempio, se hai un oggetto "obj" con il file
   *@restituisce un array di valori che corrispondono al percorso specificato nell'oggetto.
   */
  public deepSearchKey(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj: { [key: string]: any | any[] },
    path: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any[] {
    const keys = path.split('.');
    let current = obj;
    let result: unknown[] = [];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (!current) {
        return result;
      }

      if (Array.isArray(current)) {
        for (const item of current) {
          // Pass the rest of the path to the recursive call
          result = result.concat(
            this.deepSearchKey(item, keys.slice(i).join('.'))
          );
        }
        return result;
      }

      current = current[key];
    }

    return current ? [current] : [];
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

    //if the value is an array, stringify it
    if (
      (value as string)
        ?.toUpperCase()
        .match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    ) {
      return format(new Date(value as string), 'dd/MM/yyyy');
    }

    return (value as string)?.toLowerCase();
  }

  public populateWebProtocol(protocol: string, data: string) {
    if (data.includes(protocol)) {
      return data;
    }

    return `${protocol}${data}`;
  }
}
