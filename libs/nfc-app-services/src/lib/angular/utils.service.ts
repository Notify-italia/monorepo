import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
  public stringToArrayBuffer(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);

    const ab = new ArrayBuffer(byteString.length);
    const dw = new DataView(ab);

    for (let i = 0; i < byteString.length; i++) {
      dw.setUint8(i, byteString.charCodeAt(i));
    }

    return [ab];
  }
}
