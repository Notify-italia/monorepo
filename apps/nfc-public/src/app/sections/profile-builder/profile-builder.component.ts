import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  EnumNotifyAPAlign,
  EnumNotifyAPBackgroundTypes,
  EnumNotifyAPButtonStyles,
  EnumNotifyAPCorners,
  EnumNotifyAPDirections,
  EnumNotifyAPObjectFit,
  EnumNotifyAdvancedProfileItems,
  EnumNotifyUserType,
  INotifyAPAvatarItem,
  INotifyProfile,
} from '@notify/interfaces';
import { ProfileViewComponent, TailwindFormsModule } from '@notify/ngx-shared';

@Component({
  selector: 'notify-profile-builder',
  standalone: true,
  imports: [
    CommonModule,
    ProfileViewComponent,
    ReactiveFormsModule,
    TailwindFormsModule,
  ],
  templateUrl: './profile-builder.component.html',
  styles: `notify-tailwind-input {
    width: 100%;
  }
  
  .style-button {
    @applay p-4 rounded-md shadow-md bg-[#038DE2] text-white;
  }
  `,
})
export class ProfileBuilderComponent {
  public form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    description: new FormControl(''),
  });

  public get currentTemplate() {
    return this.chillProfile;
  }

  public get chillProfile() {
    const template = PROFILE_TEMPLATES_CHILL;

    if (!template.advancedProfile) {
      return template;
    }

    const avatarIndex = template.advancedProfile.items.findIndex(
      (item) => item._id === template.advancedProfile?.requiredItems.avatar
    );

    (template.advancedProfile.items[avatarIndex] as INotifyAPAvatarItem).label =
      this.form.value.name || '';

    (
      template.advancedProfile.items[avatarIndex] as INotifyAPAvatarItem
    ).description = this.form.value.description || '';

    return template;
  }
}

const PROFILE_TEMPLATES_CHILL: INotifyProfile = {
  _id: '657f61da3e18748bb264a57e',
  name: 'Emanuele Andrea',
  surname: 'Ruja',
  email: 'ruja.andrea1@gmail.com',
  phoneNumber: '3270851896',
  bio: '"Whatever happens, happens"',
  avatar:
    'https://s3-api.vps.notifyapp.it/notify-api/profiles/657f61da3e18748bb264a57e/avatar.webp?c=1715467592369',
  role: 'Social Media Manager',
  config: {
    whatsappEnabled: true,
    phoneCallEnabled: true,
    emailEnabled: true,
    avatarMask: 'hexagon',
    smsEnabled: true,
    redirectEnabled: false,
    feedbackEnabled: false,
  },
  type: EnumNotifyUserType.Agent,
  owner: '657f61da3e18748bb264a57d',
  customFields: [
    {
      iconName: 'linkedin',
      value: 'https://it.linkedin.com/in/andrea-ruja-b409531b3',
    },
    {
      iconName: 'instagram',
      value: 'ruja.exe',
    },
    {
      iconName: 'facebook',
      value: 'https://www.facebook.com/profile.php?id=61553259225621',
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  colors: {
    background: ['#629BF8', '#10B981'],
    elements: '#0A2859',
    useCompanyColors: false,
  },
  address: null,
  noteOptions: {
    showTitle: true,
  },
  note: null as any,
  profileIdentifier: '',
  advancedProfile: {
    enabled: true,
    items: [
      {
        type: EnumNotifyAdvancedProfileItems.Photo,
        visible: true,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 16,
          textColor: '#ffffff',
        },
        imgSrc:
          'https://s3-api.vps.notifyapp.it/notify-api/profiles/657f61da3e18748bb264a57e/6662280773eaaf39139b379e/Secondary Logo.png?c=1717708859043',
        showCompanyOnClick: true,
        dimension: 46,
        align: EnumNotifyAPAlign.Center,
        _id: '6662280773eaaf39139b379e',
      },
      {
        type: EnumNotifyAdvancedProfileItems.Avatar,
        visible: true,
        title: '',
        showTitle: true,
        _id: '666186f1e99500cb1e295d22',
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 18,
          textColor: '',
        },
        direction: EnumNotifyAPDirections.Vertical,
        label: '',
        sublabel: 'Co-Founder | SMM',
        useRoleSubLabel: false,
        description: '"Whatever happens, happens"',
        imgSrc:
          'https://s3-api.vps.notifyapp.it/notify-api/profiles/657f61da3e18748bb264a57e/avatar.webp?c=1715467592369',
        imgMask: 'hexagon',
        ownerImgCorner: EnumNotifyAPCorners.None,
        align: EnumNotifyAPAlign.Center,
        imgSize: 100,
        imgFit: EnumNotifyAPObjectFit.Cover,
      },
      {
        type: EnumNotifyAdvancedProfileItems.Divider,
        visible: true,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 16,
          textColor: '#ffffff',
        },
        _id: '6662288573eaaf39139b379f',
      },
      {
        type: EnumNotifyAdvancedProfileItems.Contacts,
        visible: true,
        title: '',
        showTitle: true,
        _id: '666186f1e99500cb1e295d24',
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 18,
          textColor: '',
        },
        direction: EnumNotifyAPDirections.Horizontal,
        style: EnumNotifyAPButtonStyles.Outlined,
        items: [
          {
            icon: 'phone',
            caption: 'Telefono',
            url: '3270851896',
            visible: false,
          },
          {
            icon: 'mail',
            caption: 'Email',
            url: 'ruja.andrea1@gmail.com',
            visible: true,
          },
          {
            icon: 'whatsapp',
            caption: 'WhatsApp',
            url: '3270851896',
            visible: true,
          },
          {
            icon: 'chat',
            caption: 'SMS',
            url: '3270851896',
            visible: true,
          },
        ],
      },
      {
        type: EnumNotifyAdvancedProfileItems.IFrame,
        visible: true,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: true,
          font: 'poppins',
          fontSize: 16,
          textColor: '#323060',
        },
        url: 'notifyapp.it',
        openInNotify: true,
        _id: '66622add92f4511b36a24787',
      },
      {
        type: EnumNotifyAdvancedProfileItems.Links,
        visible: true,
        title: '',
        showTitle: true,
        _id: '666186f1e99500cb1e295d25',
        textConfig: {
          enabled: true,
          font: 'kodeMono',
          fontSize: 20,
          textColor: '#ffffff',
        },
        direction: EnumNotifyAPDirections.Vertical,
        style: EnumNotifyAPButtonStyles.Filled,
        items: [
          {
            icon: 'linkedin',
            caption: 'Linkedin',
            url: 'in/andrea-ruja-b409531b3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
            visible: true,
          },
          {
            icon: 'instagram',
            caption: 'Instagram',
            url: 'ruja.exe',
            visible: true,
          },
          {
            icon: 'facebook',
            caption: 'Facebook',
            url: 'https://www.facebook.com/profile.php?id=61553259225621',
            visible: true,
          },
        ],
        openInNotify: false,
      },
    ],
    pageSettings: {
      backgroundType: EnumNotifyAPBackgroundTypes.Image,
      imgSrc:
        'https://s3-api.vps.notifyapp.it/notify-api/profiles/657f61da3e18748bb264a57e/background/Blu_Scuro_Anime_UI_Scuro_Privacy_Citazione__Frase_Sfondo_per_Cellulare_png.png?c=1717710125550',
      fill: '#0A2859',
      gradient: {
        direction: EnumNotifyAPDirections.Vertical,
        colors: [
          {
            value: '#629BF8',
          },
          {
            value: '#10B981',
          },
        ],
      },
      textColor: '#ffffff',
      align: EnumNotifyAPAlign.Start,
      padding: 0.5,
      verticalSpacing: 0.5,
      font: 'inter',
      fontSize: 18,
      redirectUrl: '',
      topPadding: 0,
      backgroundBrightness: 100,
      backgroundBlur: 0,
      hideContactSave: false,
      useCompanyTheme: false,
      contactOverrides: {
        name: '',
      },
    },
    requiredItems: {
      feedback: '',
      avatar: '666186f1e99500cb1e295d22',
    },
  },
  reviewRedirect: null,
  redirectUrl: null,
  piva: null,
};
