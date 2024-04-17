import { Injectable } from '@angular/core';
import { AppError } from '@notify/interfaces';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { HttpService } from './http.service';

export enum EnumDicebearAvatarStyles {
  Bottts = 'bottts',
  Avataaars = 'avataaars',
  Adventurer = 'adventurer',
  Gridy = 'gridy',
  Identicon = 'identicon',
  BigSmile = 'big-smile',
  BigEars = 'big-ears',
  FunEmoji = 'fun-emoji',
  Micah = 'micah',
  Lorelei = 'lorelei',
  PixelArt = 'pixel-art',
  Croodles = 'croodles',
  BotttsNeutral = 'bottts-neutral',
  CroodlesNeutral = 'croodles-neutral',
  Icons = 'icons',
  Initials = 'initials',
  LoreleiNeutral = 'lorelei-neutral',
  Miniavs = 'miniavs',
  Notionists = 'notionists',
  OpenPeeps = 'open-peeps',
  NotionistsNeutral = 'notionists-neutral',
  Personas = 'personas',
  AdventurerNeutral = 'adventurer-neutral',
  Rings = 'rings',
  PixelArtNeutral = 'pixel-art-neutral',
  Shapes = 'shapes',
  Thumbs = 'thumbs',
}

@Injectable()
export class UtilsService {
  public get apiUrl(): string {
    return this._http.apiBaseUrl;
  }

  constructor(private _toastr: ToastrService, private _http: HttpService) {}

  public diceBearAvatar(config: {
    style: EnumDicebearAvatarStyles;
    seed: string;
  }) {
    return `https://api.dicebear.com/7.x/${config.style}/png?seed=${config.seed}`;
  }

  public stringToArrayBuffer(dataURI: string) {
    if (!dataURI) {
      return [new ArrayBuffer(0)];
    }

    const byteString = atob(dataURI.split(',')[1]);

    const ab = new ArrayBuffer(byteString.length);
    const dw = new DataView(ab);

    for (let i = 0; i < byteString.length; i++) {
      dw.setUint8(i, byteString.charCodeAt(i));
    }

    return [ab];
  }

  public async arrayBufferToBase64(buffer: ArrayBuffer) {
    //arraybuffer to blob
    const blob = new Blob([buffer]);

    const result = new Promise<string | ArrayBuffer | null>((resolve) => {
      //blob to base64 without using FileReader
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        return resolve(reader.result);
      };
    });

    return result;
  }

  public errorHandler<T>(error: AppError, returnValue?: T) {
    this._toastr.error(
      error?.error?.errors?.[0]?.message || 'Si è verificato un errore',
      'Errore'
    );
    return of((returnValue || []) as T);
  }

  public compensateUTCDate(date: Date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }

  public toggleScrollLock(lock: boolean) {
    const html = document.getElementsByTagName('html')[0];

    if (lock) {
      html.classList.add('lock-scroll');
      return;
    }

    html.classList.remove('lock-scroll');
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
      String(value)
        ?.toUpperCase()
        .match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    ) {
      return format(new Date(value as string), 'dd/MM/yyyy');
    }

    return String(value)?.toLowerCase();
  }

  public populateWebProtocol(protocol: string, data: string) {
    if (data.includes(protocol)) {
      return data;
    }

    return `${protocol}${data.trim()}`;
  }

  public currentTailwindMediaQuery():
    | 'none'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl' {
    const width = window.innerWidth;

    if (width < 640) {
      return 'none';
    }

    if (width < 768) {
      return 'sm';
    }

    if (width < 1024) {
      return 'md';
    }

    if (width < 1280) {
      return 'lg';
    }

    if (width < 1536) {
      return 'xl';
    }

    return '2xl';
  }
}
