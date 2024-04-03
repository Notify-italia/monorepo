import { Injectable } from '@angular/core';

import {
  EnumNotifyProfileSources,
  EnumNotifyUserType,
  INotifyProfile,
} from '@notify/interfaces';
import { HttpService } from './http.service';

@Injectable()
export class ProfileService {
  constructor(private http: HttpService) {}

  public cleanPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/[^0-9]/g, '');
  }

  public buildCompanyLocation(d?: INotifyProfile['address']) {
    if (!d || !d.street || !d.number || !d.city) {
      return null;
    }

    return `${d.street} ${d.number}, ${d.city}`;
  }

  public genPlayerUrl(
    publicUrl: string,
    id: string,
    source?: EnumNotifyProfileSources
  ) {
    return `${publicUrl}/profile?p=${id}` + (source ? `&s=${source}` : '');
  }

  public patchProfile<T extends EnumNotifyUserType>(
    body: INotifyProfile,
    id?: string
  ) {
    return this.http.patch<INotifyProfile, INotifyProfile<T>>(
      `/v1/profile`,
      body,
      id ? { id } : undefined
    );
  }

  public getProfile<T extends EnumNotifyUserType>(id?: string) {
    return this.http.get<INotifyProfile<T>>(
      `/v1/profile`,
      id ? { id } : undefined
    );
  }

  public async saveContact(d: INotifyProfile, publicUrl: string) {
    if (!d) {
      return;
    }

    const avatar = this._isAvatarBase64(d.avatar || '')
      ? d.avatar
      : await fetch(d.avatar || '')
          .then((r) => r.blob())
          .then(
            (blob) =>
              new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  resolve(reader.result as string);
                };
                reader.readAsDataURL(blob);
              })
          );

    const name = d.name || '';
    const surname = d.surname || '';

    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${surname};${name};
FN:${name} ${surname}
ORG:${d.company?.name || name}
TEL;TYPE=work,voice;VALUE=uri:${this.cleanPhoneNumber(d.phoneNumber || '')}
PHOTO;ENCODING=b:${avatar?.split(',')[1]}
item2.URL;type=pref:${this.genPlayerUrl(
      publicUrl,
      d._id,
      EnumNotifyProfileSources.Contacts
    )}
ADR;TYPE=work:;;${this.buildCompanyLocation(d?.company?.address || d.address)}
EMAIL:${d.email}
END:VCARD`;

    //saving the file by creating an anchor tag and simulating a click on it
    const a = document.createElement('a');
    a.setAttribute(
      'href',
      'data:text/vcard;charset=utf-8,' + encodeURIComponent(vcard)
    );
    a.setAttribute(
      'download',
      `${d.name} ${d.surname?.length ? ' ' + d.surname : ''}.vcf`
    );
    a.click();
  }

  private _isAvatarBase64(avatar: string) {
    const base64regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

    return base64regex.test(avatar);
  }
}
