import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  EnumNotifyAdvancedProfileItems,
  EnumNotifyUserType,
  INotifyAPAvatarItem,
  INotifyAPBaseButton,
  INotifyAPContactsItem,
  INotifyAPLinksItem,
  INotifyProfile,
} from '@notify/interfaces';
import {
  ProfilePlayerFactory,
  ProfileViewComponent,
  SSRBaseComponent,
  TailwindFormsModule,
  UploadComponent,
  UtilsService,
} from '@notify/ngx-shared';
import axios from 'axios';
import { debounceTime, takeUntil, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'notify-profile-builder',
  standalone: true,
  imports: [
    CommonModule,
    ProfileViewComponent,
    ReactiveFormsModule,
    TailwindFormsModule,
    UploadComponent,
  ],
  providers: [UtilsService, ProfilePlayerFactory],
  templateUrl: './profile-builder.component.html',
  styleUrls: ['./profile-builder.component.scss'],
})
export class ProfileBuilderComponent extends SSRBaseComponent {
  public utilsService = inject(UtilsService);
  private _profileFactory = inject(ProfilePlayerFactory);

  public form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    role: new FormControl(''),
    image: new FormControl(''),
  });

  public showProfile = false;
  public inputElementsCss =
    'bg-gray-100 focus:ring-2 ring-accent-color rounded-2xl pl-4 py-6 !outline-none ring-offset-2 w-full smooth hover:brightness-90 backdrop-blur';

  public currentTemplate: {
    index: number;
    template?: INotifyProfile<EnumNotifyUserType>;
  } = {
    index: -1,
  };

  public templates: INotifyProfile<EnumNotifyUserType>[] = [];

  private _latestCollection: this['form']['value'] | null = null;

  public get preparedTemplate() {
    if (!this.currentTemplate.template) {
      return null;
    }
    return this._prepareTemplate(this.currentTemplate.template);
  }

  override async componentInitialized() {
    if (this.utilsService.isMobile) {
      return;
    }

    await this._prepareProfiles();

    this.showProfile = true;

    this.shuffleTemplates();
    this.componentIsStable();

    this.form.valueChanges
      .pipe(
        debounceTime(5000),
        takeUntil(this.destroyed$),
        tap(() => this._collectData())
      )
      .subscribe();
  }

  public shuffleTemplates() {
    const randomIndex = this._randomIndex();

    this.currentTemplate.index = randomIndex;
    this.currentTemplate.template = JSON.parse(
      JSON.stringify(this.templates[randomIndex])
    );

    if (!this.utilsService.isMobile) {
      return;
    }

    this._createMobileProfile();
  }

  private _createMobileProfile() {
    this._profileFactory.create({
      profile: this.currentTemplate
        .template as INotifyProfile<EnumNotifyUserType>,
      isRunningOnPlayer: true,
      hideShare: true,
    });
  }

  private _prepareTemplate(template: INotifyProfile<EnumNotifyUserType>) {
    if (!template?.advancedProfile) {
      console.warn('Template has no advanced profile');
      return template;
    }

    const avatarIndex = template.advancedProfile.items.findIndex(
      (item) => item._id === template.advancedProfile?.requiredItems.avatar
    );

    const srcProfile = this.templates[this.currentTemplate.index]
      .advancedProfile?.items[avatarIndex] as INotifyAPAvatarItem;

    //Nome
    (template.advancedProfile.items[avatarIndex] as INotifyAPAvatarItem).label =
      this.form.value.name || srcProfile?.label || '';

    //Ruolo
    (
      template.advancedProfile.items[avatarIndex] as INotifyAPAvatarItem
    ).sublabel = this.form.value.role || srcProfile?.sublabel || '';

    //Avatar
    (
      template.advancedProfile.items[avatarIndex] as INotifyAPAvatarItem
    ).imgSrc = this.form.value.image || srcProfile?.imgSrc || '';

    return template;
  }

  private async _prepareProfiles() {
    if (!this.isPlatformBrowser) {
      return;
    }

    this.templates = (
      await axios.get<{
        profiles: INotifyProfile<EnumNotifyUserType>[];
      }>(
        'https://s3-api.vps.notifyapp.it/assets/public-website-builder-templates.json'
      )
    ).data.profiles;

    this.templates = this.templates.map((v) => {
      //replace contacts with offcenter phone number
      const contacts = v.advancedProfile?.items.filter(
        (i) => i.type === EnumNotifyAdvancedProfileItems.Contacts
      ) as INotifyAPContactsItem[];
      const offcenterPhoneNumber = '3517410976';
      contacts?.forEach((i) => {
        if (!i?.items) {
          return;
        }
        return {
          ...i,
          items: i?.items?.forEach((z: INotifyAPBaseButton) => {
            switch (z.icon) {
              case 'phone':
                z.url = `tel:${offcenterPhoneNumber}`;
                break;
              case 'chat':
                z.url = `sms:${offcenterPhoneNumber}`;
                break;
              case 'mail':
                z.url = `mailto:info@notifyapp.it`;
                break;
              case 'gmail':
                z.url = `mailto:info@notifyapp.it`;
                break;
              case 'whatsapp':
                z.url = `https://wa.me/${offcenterPhoneNumber}`;
                break;
            }
          }),
        };
      });

      //replace links with offcenter links
      const links = v.advancedProfile?.items.filter(
        (i) => i.type === EnumNotifyAdvancedProfileItems.Links
      ) as INotifyAPLinksItem[];

      links?.forEach((i) => {
        if (!i?.items) {
          return;
        }
        return {
          ...i,
          items: i?.items?.forEach((z: INotifyAPBaseButton) => {
            switch (z.icon) {
              case 'instagram':
                z.url = `notify_it`;
                break;
              case 'facebook':
                z.url = `https://www.facebook.com/people/Notify-ITA/61555763732300/`;
                break;
              case 'linkedin':
                z.url = `company/notifyitalia/`;
                break;
              case 'mail':
                z.url = `mailto:info@notifyapp.it`;
                break;
              case 'globe':
                z.url = `https://notifyapp.it`;
                break;
              case 'gmail':
                z.url = `mailto:info@notifyapp.it`;
                break;
            }
          }),
        };
      });

      v.advancedProfile?.items.forEach((i) => {
        const link = links.find((l) => l._id === i._id);

        if (link) {
          return link;
        }

        const contact = contacts.find((c) => c._id === i._id);

        if (contact) {
          return contact;
        }

        return i;
      });

      return v;
    });
  }

  private _randomIndex(): number {
    const value = Math.floor(Math.random() * this.templates.length);

    if (value === this.currentTemplate.index) {
      return this._randomIndex();
    }

    return value;
  }

  private _collectData() {
    const fV = {
      name: this.form.value.name,
      email: this.form.value.email,
      phone: this.form.value.phone,
      role: this.form.value.role,
    };
    //collect user informations if he fills out at least name and either email or phone
    if (!fV.name) {
      return;
    }

    if (!fV.email && !fV.phone) {
      return;
    }

    if (JSON.stringify(fV) === JSON.stringify(this._latestCollection)) {
      return;
    }

    this._latestCollection = {
      name: this.form.value.name,
      email: this.form.value.email,
      phone: this.form.value.phone,
      role: this.form.value.role,
    };

    axios.post(`${environment.apiUrl}/v1/sales/collect`, {
      d: Buffer.from(JSON.stringify(fV)).toString('base64'),
    });
  }
}
