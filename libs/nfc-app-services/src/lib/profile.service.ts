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

  public saveContact(d: INotifyProfile, publicUrl: string): void {
    if (!d) {
      return;
    }

    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${d.surname};${d.name};
FN:${d.name} ${d.surname}
ORG:${d.company?.name || d.name}
TEL;TYPE=work,voice;VALUE=uri:${this.cleanPhoneNumber(d.phoneNumber || '')}
PHOTO;ENCODING=b:${d.avatar?.split(',')[1]}
item2.URL;type=pref:${this.genPlayerUrl(
      publicUrl,
      d._id,
      EnumNotifyProfileSources.Contacts
    )},
ADR;TYPE=work:;;${this.buildCompanyLocation(d?.company?.address)}
EMAIL:${d.email}
END:VCARD`;

    //saving the file by creating an anchor tag and simulating a click on it
    const a = document.createElement('a');
    a.setAttribute(
      'href',
      'data:text/vcard;charset=utf-8,' + encodeURIComponent(vcard)
    );
    a.setAttribute('download', 'contact.vcf');
    a.click();
  }
}
