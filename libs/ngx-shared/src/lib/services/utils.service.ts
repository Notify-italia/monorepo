import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { AppError } from '@notify/interfaces';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { ErrorResult, SuccessResult } from 'open-graph-scraper';
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

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private _platformID = inject(PLATFORM_ID);
  public get apiUrl(): string {
    return this._http.apiBaseUrl;
  }

  public get isMobile(): boolean {
    return ['none', 'sm', 'md'].includes(this.currentTailwindMediaQuery());
  }

  public get availableScreenHeight() {
    if (!this.isMobile) {
      return { height: '99vh' };
    }

    //6vh is the height of the header
    return {
      height: `calc(${window.innerHeight}px - 4.5rem - env(safe-area-inset-top))`,
    };
  }

  constructor(private _toastr: ToastrService, private _http: HttpService) {}

  public diceBearAvatar(config: {
    style: EnumDicebearAvatarStyles;
    seed: string;
  }) {
    return `https://api.dicebear.com/7.x/${config.style}/png?seed=${config.seed}`;
  }

  public getGooglePlaceId(place: string) {
    return this._http.get<{ result: string }>('/v1/google/place-id', {
      place,
    });
  }

  public uploadTempFile(data: string, extension: string) {
    return this._http.post<
      {
        data: string;
        extension: string;
      },
      {
        url: string;
      }
    >(`/v1/s3/temp`, {
      data,
      extension,
    });
  }

  public getOpenGraphMetadata(url: string) {
    return this._http.get<ErrorResult | SuccessResult>(
      '/v1/utils/open-graph-scraper',
      {
        url,
      }
    );
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

  public toggleScrollLock(lock: boolean, element?: HTMLElement) {
    const html = element ?? document.getElementsByTagName('html')[0];

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
    if (!isPlatformBrowser(this._platformID)) {
      return 'none';
    }

    const width = window?.innerWidth;

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

  public asyncForEach<T = unknown>(
    array: T[],
    callback: (item: T, index: number, array: T[]) => Promise<void>
  ) {
    return new Promise<void>((resolve) => {
      array.forEach(async (item, index, array) => {
        await callback(item, index, array);
        if (index === array.length - 1) {
          resolve();
        }
      });
    });
  }

  public randomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  public navigateToUrl(url: string) {
    window.open(url, '_blank');
  }

  public isValidUrl(url: string) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    );

    return !!pattern.test(url);
  }

  public getContrastingColor(hex: string) {
    const hexColor = hex.replace('#', '');
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    const contrast =
      (Math.round(r * 299) + Math.round(g * 587) + Math.round(b * 114)) / 1000;

    return contrast >= 128 ? '#000000' : '#ffffff';
  }

  public changeColorBrightness(hex: string, percent: number) {
    // Remove the '#' character from the hex string
    const hexColor = hex.replace('#', '');

    // Convert the hex color to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    // Calculate the brightness adjustment factor
    const brightnessFactor = percent / 100;

    // Adjust the RGB values based on the brightness factor
    const adjustedR = Math.round(r * brightnessFactor);
    const adjustedG = Math.round(g * brightnessFactor);
    const adjustedB = Math.round(b * brightnessFactor);

    // Convert the adjusted RGB values back to hex
    const adjustedHex = `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG
      .toString(16)
      .padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;

    return adjustedHex;
  }

  public getTemporalDelta(date: Date) {
    const now = new Date();
    const delta = now.getTime() - date.getTime();

    if (delta < 60000) {
      return 'ora';
    }

    if (delta < 3600000) {
      return `${Math.floor(delta / 60000)}m fa`;
    }

    if (delta < 86400000) {
      return `${Math.floor(delta / 3600000)}h fa`;
    }

    return `${Math.floor(delta / 86400000)}g fa`;
  }
}
