import { inject, Injectable } from '@angular/core';

import {
  EnumNotifyAdvancedProfileItems,
  EnumNotifyAPBackgroundTypes,
  EnumNotifyProfileSources,
  EnumNotifyUserType,
  INotifyAPAvatarItem,
  INotifyAPContactItem,
  INotifyAPContactsItem,
  INotifyAPPlaceItem,
  INotifyProfile,
} from '@notify/interfaces';
import { prominent } from 'color.js';

import { DomSanitizer } from '@angular/platform-browser';
import { INotifyAvatarConfig } from '../standalones';
import { HttpService } from './http.service';

export const DEFAULT_GRADIENT_STOPS = ['#0A2859', '#041127'];

@Injectable()
export class ProfileService {
  private _http = inject(HttpService);
  private _domSanitizer = inject(DomSanitizer);

  public defaultGradientStops = DEFAULT_GRADIENT_STOPS;

  public cleanPhoneNumber(phoneNumber: string): string {
    return phoneNumber?.replace(/[^0-9]/g, '');
  }

  public v2Update(agent?: string) {
    return this._http.post<
      {
        agent?: string;
      },
      INotifyProfile
    >(`/v1/profile/v2-update`, {
      agent,
    });
  }

  public getProfileFooter(socketId: string) {
    return this._domSanitizer.bypassSecurityTrustHtml(
      `<div class="text-xs">
      <div
        class="flex flex-col w-full lg:!text-current"
        [style.color]="p.colors.elements"
      >
        <div>
          Condivisione files: <span class="font-bold">${socketId}</span>
        </div>
        <div>
          <a href="https://notifyapp.it" target="_blank">
            Provided by <span class="font-bold">Notify</span>
          </a>
        </div>
      </div>
    </div>`
    );
  }

  public v2BetaAccess(profile: string) {
    return this._http.get<{
      hasAccess: boolean;
    }>(`/v1/profile/v2-beta-access`, {
      profile,
    });
  }

  public buildCompanyLocation(p?: INotifyProfile) {
    const d = p?.address;
    if (!d || !d.street || !d.number || !d.city) {
      return null;
    }

    const _address = `${d.street} ${d.number}, ${d.city}`;

    return {
      address: `${_address} ${p.name || ''}`?.replace(' ', '+').toLowerCase(),
      label: _address,
    };
  }

  public async getThemeColor(profile: INotifyProfile): Promise<string> {
    if (!profile.advancedProfile?.enabled) {
      return profile.colors.background[0] || this.defaultGradientStops[0];
    }

    const ps = profile.advancedProfile.pageSettings;

    const type = ps.backgroundType;

    if (
      profile.advancedProfile.pageSettings.useCompanyTheme &&
      profile.company
    ) {
      return this.getThemeColor(profile.company);
    }

    switch (type) {
      case EnumNotifyAPBackgroundTypes.Fill:
        return ps.fill;
      case EnumNotifyAPBackgroundTypes.Gradient:
        return ps.gradient.colors[0].value;
      case EnumNotifyAPBackgroundTypes.Image:
        return (await prominent(ps.imgSrc, {
          format: 'hex',
          amount: 1,
        })) as string;
    }
  }

  public patchProfile<T extends EnumNotifyUserType>(
    body: Partial<INotifyProfile>,
    id?: string
  ) {
    return this._http.patch<Partial<INotifyProfile>, INotifyProfile<T>>(
      `/v1/profile`,
      body,
      id ? { id } : undefined
    );
  }

  public getProfile<T extends EnumNotifyUserType>(id?: string) {
    return this._http.get<INotifyProfile<T>>(
      `/v1/profile`,
      id ? { id } : undefined
    );
  }

  public checkProfileIdentifier(profileIdentifier: string) {
    return this._http.post<
      {
        profileIdentifier: string;
      },
      {
        available: boolean;
      }
    >(`/v1/profile/check-identifier`, {
      profileIdentifier,
    });
  }

  public uploadFile(
    file: {
      name: string;
      blob: string | ArrayBuffer | null;
    },
    profile: string,
    item: string
  ) {
    return this._http.post<unknown, { url: string }>(`/v1/profile/file`, {
      profile,
      item,
      file,
    });
  }

  public deleteFile(profile: string, item: string, name: string) {
    return this._http.delete(`/v1/profile/file`, {
      profile,
      item,
      name,
    });
  }

  public getLocations(profile: INotifyProfile): Partial<INotifyAPPlaceItem>[] {
    if (!profile.advancedProfile?.enabled) {
      return [
        {
          address: profile.address?.street || '',
          civicNumber: profile.address?.number || '',
          city: profile.address?.city || '',
        },
      ];
    }

    return profile.advancedProfile.items.filter(
      (i) => i.type === EnumNotifyAdvancedProfileItems.Place && i.visible
    ) as INotifyAPPlaceItem[];
  }

  public getPhoneNumbers(profile: INotifyProfile): INotifyAPContactItem[] {
    if (!profile.advancedProfile?.enabled) {
      return [
        {
          caption: profile.phoneNumber || '',
          icon: 'phone',
          url: profile.phoneNumber || '',
          visible: true,
        },
      ];
    }

    const phoneIcons = ['phone', 'whatsapp', 'voicemail'];

    const contacts = profile.advancedProfile.items.filter(
      (i) =>
        i.type === EnumNotifyAdvancedProfileItems.Contacts &&
        i.items.some((ii) => phoneIcons.includes(ii.icon))
    ) as INotifyAPContactsItem[];

    if (!contacts?.length) {
      return [];
    }

    return contacts
      .map((i) =>
        i.items.filter((i) => phoneIcons.includes(i.icon) && i.visible)
      )
      .flat();
  }

  public getEmails(profile: INotifyProfile): INotifyAPContactItem[] {
    if (!profile.advancedProfile?.enabled) {
      return [
        {
          caption: profile.email || '',
          icon: 'email',
          url: profile.email || '',
          visible: true,
        },
      ];
    }

    const _mailIcons = ['mail', 'gmail'];

    const contacts = profile.advancedProfile.items.filter(
      (i) =>
        i.type === EnumNotifyAdvancedProfileItems.Contacts &&
        i.items.some((ii) => ['mail', 'gmail'].includes(ii.icon)) &&
        i.visible
    ) as INotifyAPContactsItem[];

    return contacts
      .map((i) =>
        i.items.filter((i) => _mailIcons.includes(i.icon) && i.visible)
      )
      .flat();
  }

  public getProfileName(profile: INotifyProfile): string {
    if (!profile.advancedProfile?.enabled) {
      return (profile.name || '') + ' ' + (profile.surname || '');
    }

    const avatar = profile.advancedProfile.items.find(
      (i) => i._id === profile.advancedProfile?.requiredItems.avatar
    ) as INotifyAPAvatarItem;

    if (!avatar) {
      return 'Ignoto';
    }

    return avatar.label || 'Ignoto';
  }

  public getContactName(profile: INotifyProfile) {
    return (
      this.getContactOverrides(profile)?.name || this.getProfileName(profile)
    ).trim();
  }

  public getContactOverrides(profile: INotifyProfile) {
    if (!profile.advancedProfile?.enabled) {
      return null;
    }

    return profile.advancedProfile.pageSettings.contactOverrides;
  }

  public getProfileAvatar(profile: INotifyProfile): string {
    if (!profile.advancedProfile?.enabled) {
      return profile.avatar || '';
    }

    const avatar = profile.advancedProfile.items.find(
      (i) => i._id === profile.advancedProfile?.requiredItems.avatar
    ) as INotifyAPAvatarItem;

    return avatar?.imgSrc || '';
  }

  public getProfileAvatarComponentConfig(
    profile: INotifyProfile,
    size = '10'
  ): INotifyAvatarConfig {
    if (!profile.advancedProfile?.enabled) {
      return {
        src: profile.avatar || '',
        size,
        mask: profile.config.avatarMask || '',
        placeholderSeed: profile._id,
      };
    }

    const avatar = profile.advancedProfile.items.find(
      (i) => i._id === profile.advancedProfile?.requiredItems.avatar
    ) as INotifyAPAvatarItem;

    return {
      src: avatar?.imgSrc || '',
      size,
      mask: avatar.imgMask || '',
      placeholderSeed: profile._id,
    };
  }

  public getPkpass(profile?: string) {
    return this._http.get<{
      base64: string;
    }>(`/v1/profile/wallet/pkpass`, {
      profile,
    });
  }

  public getGooglePass(profile?: string) {
    return this._http.get<{
      passUrl: string;
    }>(`/v1/profile/wallet/google-pass`, {
      profile,
    });
  }

  public async saveContact(d: INotifyProfile, publicUrl: string) {
    if (!d) {
      return;
    }

    const _avatar = this.getProfileAvatar(d);

    const avatar = this._isAvatarBase64(_avatar || '')
      ? _avatar
      : await fetch(_avatar || '')
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

    const _cName = d.company ? this.getContactName(d.company) : '';

    const vcard = `BEGIN:VCARD
VERSION:3.0
${this._buildVcardName(d)}
ORG:${_cName}
PHOTO;BASE64;TYPE=IMAGE:${avatar?.split(',')[1]}
item2.URL;type=pref:${`${publicUrl}/p/${d._id}?s=${EnumNotifyProfileSources.Contacts}`}
${this._buildVcardPhoneNumbers(this.getPhoneNumbers(d))}
${this._buildVcardLocations(this.getLocations(d))}
${this._buildVcardEmails(this.getEmails(d))}
END:VCARD`;

    //saving the file by creating an anchor tag and simulating a click on it
    const a = document.createElement('a');
    a.setAttribute(
      'href',
      'data:text/vcard;charset=utf-8,' + encodeURIComponent(vcard)
    );
    a.setAttribute('download', `${this.getContactName(d)}.vcf`);
    a.click();
  }

  private _buildVcardName(profile: INotifyProfile) {
    const _pName =
      this.getContactOverrides(profile)?.name || this.getProfileName(profile);

    if (profile.type === EnumNotifyUserType.Company) {
      return `N:${_pName}`;
    }

    const [name, surname] = _pName.split(' ');

    return `N:${surname || ''};${name || ''};
FN:${name || ''} ${surname || ''}`;
  }

  private _buildVcardPhoneNumbers(phones: INotifyAPContactItem[]) {
    if (!phones.length) {
      return '';
    }

    return this._uniqueArray(
      phones.map((p) => {
        const isLandline = p.icon === 'voicemail';

        return `TEL;TYPE=${
          isLandline ? 'work' : 'cell'
        },voice,VALUE=uri:+39${this.cleanPhoneNumber(p.url)}`;
      })
    ).join('\n');
  }

  private _buildVcardEmails(emails: INotifyAPContactItem[]) {
    if (!emails.length) {
      return '';
    }

    return this._uniqueArray(
      emails.map((e) => {
        return `EMAIL;TYPE=work:${e.url}`;
      })
    ).join('\n');
  }

  private _buildVcardLocations(locations: Partial<INotifyAPPlaceItem>[]) {
    return locations
      .map((l) => {
        return `ADR;TYPE=work:;;${l.address} ${l.civicNumber}, ${l.city}`;
      })
      .join('\n');
  }

  private _isAvatarBase64(avatar: string) {
    const base64regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

    return base64regex.test(avatar);
  }

  private _uniqueArray<T>(arr: T[]): T[] {
    return arr.filter((value, index, self) => self.indexOf(value) === index);
  }
}
