import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  UnknownObject,
} from '@notify/interfaces';
import {
  ProfileViewComponent,
  TailwindFormsModule,
  UploadComponent,
} from '@notify/ngx-shared';

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
  templateUrl: './profile-builder.component.html',
  styles: `notify-tailwind-input {
    width: 100%;
  }
  
  .style-button {
    @apply p-4 rounded-md shadow-md backdrop-blur-md bg-white/10 text-slate-800 w-48 h-16 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50 hover:h-48 hover:rounded-2xl hover:text-white;
  }
  `,
})
export class ProfileBuilderComponent {
  public form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    type: new FormControl('corporate'),
  });

  public showProfile = false;

  public get currentTemplate() {
    switch (this.form.value.type) {
      case 'corporate':
        return this._prepareTemplate(PROFILE_TEMPLATES_CORPORATE);
      case 'chill':
        return this._prepareTemplate(PROFILE_TEMPLATES_CHILL);
      case 'grunge':
        return this._prepareTemplate(PROFILE_TEMPLATES_GRUNGE);
      default:
        return this._prepareTemplate(PROFILE_TEMPLATES_CORPORATE);
    }
  }

  public onSubmit() {
    this.showProfile = true;
  }

  private _prepareTemplate(template: INotifyProfile) {
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

    (
      template.advancedProfile.items[avatarIndex] as INotifyAPAvatarItem
    ).imgSrc = this.form.value.image || '';

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
        sublabel: 'Web Developer Freelancer',
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

const PROFILE_TEMPLATES_CORPORATE: UnknownObject = {
  _id: '65eedfa9ac3a0d7b566667de',
  name: 'Marco',
  surname: 'De Luca',
  email: 'marco.deluca@squarehead.it',
  phoneNumber: '321456987',
  bio: 'Presso Squarehead Italia',
  avatar:
    'https://s3-api.vps.notifyapp.it/notify-api/profiles/65eedfa9ac3a0d7b566667de/avatar.webp',
  role: "Responsabile del Design e dell'Innovazione",
  config: {
    whatsappEnabled: true,
    phoneCallEnabled: true,
    emailEnabled: true,
    avatarMask: 'squircle',
    smsEnabled: false,
    redirectEnabled: false,
    feedbackEnabled: false,
  },
  type: 'agent',
  owner: {
    $oid: '65eedfa9ac3a0d7b566667dd',
  },
  address: null,
  reviewRedirect: null,
  redirectUrl: null,
  colors: {
    background: ['#3B82F6', '#8B8B8B'],
    elements: '#FFFFFF',
    useCompanyColors: false,
  },
  customFields: [
    {
      iconName: 'linkedin',
      value: 'li',
      _id: {
        $oid: '66709288ac39d3942c5eace1',
      },
    },
    {
      iconName: 'deviantart',
      value: 'dsf',
      _id: {
        $oid: '66709288ac39d3942c5eace2',
      },
    },
    {
      iconName: 'facebook',
      value: 'li',
      _id: {
        $oid: '66709288ac39d3942c5eace3',
      },
    },
    {
      iconName: 'googlecalendar',
      value: 'squarehead.it',
      _id: {
        $oid: '66709288ac39d3942c5eace4',
      },
    },
  ],
  createdAt: {
    $date: '2024-03-11T10:40:41.991Z',
  },
  updatedAt: {
    $date: '2024-06-17T19:59:38.405Z',
  },
  noteOptions: {
    showTitle: true,
  },
  advancedProfile: {
    enabled: true,
    items: [
      {
        type: 'links',
        visible: true,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'bitter',
          fontSize: 20,
          textColor: '#ffffff',
        },
        style: 'filled',
        direction: 'vertical',
        openInNotify: false,
        items: [
          {
            icon: 'googlecalendar',
            url: '',
            caption: '15 Minute Meeting',
            visible: true,
          },
        ],
        _id: '66709326734bedcfd016c087',
      },
      {
        type: 'links',
        visible: true,
        title: '',
        showTitle: true,
        _id: '6670928bac39d3942c5eacfd',
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 17.5,
          textColor: '#ffffff',
        },
        direction: 'vertical',
        style: 'outlined',
        items: [
          {
            icon: 'linkedin',
            caption: 'Colleghiamoci',
            url: 'li',
            visible: true,
          },
          {
            icon: 'gmail',
            url: '',
            caption: "Inviami un' email",
            visible: false,
          },
        ],
        openInNotify: false,
      },
      {
        type: 'divider',
        visible: true,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 16,
          textColor: '#ffffff',
        },
        _id: '66709321734bedcfd016c086',
      },
      {
        type: 'avatar',
        visible: true,
        title: '',
        showTitle: true,
        _id: '6670928bac39d3942c5eacfa',
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: '18',
          textColor: '',
        },
        direction: 'vertical',
        label: 'Marco De Luca',
        sublabel: "Responsabile del Design e dell'Innovazione",
        useRoleSubLabel: true,
        description: 'Presso Squarehead Italia',
        imgSrc:
          'https://s3-api.vps.notifyapp.it/notify-api/profiles/65eedfa9ac3a0d7b566667de/avatar.webp',
        imgMask: 'squircle',
        ownerImgCorner: 'bottom-right',
        align: 'center',
        imgSize: 100,
        imgFit: 'cover',
      },
      {
        type: 'contacts',
        visible: true,
        title: '',
        showTitle: true,
        _id: '6670928bac39d3942c5eacfc',
        textConfig: {
          enabled: true,
          font: 'poppins',
          fontSize: 24.5,
          textColor: '',
        },
        direction: 'horizontal',
        style: 'text',
        items: [
          {
            icon: 'phone',
            caption: 'Telefono',
            url: '321456987',
            visible: true,
          },
          {
            icon: 'mail',
            caption: 'Email',
            url: 'marco.deluca@squarehead.it',
            visible: true,
          },
          {
            icon: 'chat',
            caption: 'Messaggio',
            url: '',
            visible: true,
          },
        ],
      },
      {
        type: 'divider',
        visible: false,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 16,
          textColor: '#ffffff',
        },
        _id: '667092f8734bedcfd016c085',
      },
      {
        type: 'place',
        visible: true,
        title: 'Passa a trovarci...',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 16,
          textColor: '#ffffff',
        },
        address: 'Via Tirreno',
        civicNumber: '20',
        city: 'Prato',
        companyName: 'Offcenter SRL',
        showStreetName: true,
        zoom: 12,
        _id: '667092b1734bedcfd016c084',
      },
    ],
    pageSettings: {
      backgroundType: 'gradient',
      imgSrc: '',
      fill: '',
      gradient: {
        direction: 'vertical',
        colors: [
          {
            value: '#292929',
          },
          {
            value: '#000000',
          },
        ],
      },
      topPadding: 0,
      textColor: '#e6e6e6',
      align: 'flex-start',
      padding: 0.5,
      verticalSpacing: 0.5,
      font: 'ebGaramond',
      fontSize: '19',
      redirectUrl: '',
      hideContactSave: false,
      backgroundBlur: 0,
      backgroundBrightness: 100,
      useCompanyTheme: false,
      contactOverrides: {
        name: '',
      },
    },
    requiredItems: {
      feedback: '',
      avatar: '6670928bac39d3942c5eacfa',
    },
    _id: {
      $oid: '6670928bac39d3942c5eacfe',
    },
  },
};

const PROFILE_TEMPLATES_GRUNGE: UnknownObject = {
  _id: {
    $oid: '657f565d539981b49a39d5a2',
  },
  name: 'Leonardo',
  surname: 'Miraka',
  email: 'leonardo.m@notifyapp.it',
  phoneNumber: '3240552651',
  bio: null,
  avatar:
    'https://s3-api.vps.notifyapp.it/notify-api/profiles/657f565d539981b49a39d5a2/avatar.webp',
  role: 'CEO',
  config: {
    whatsappEnabled: true,
    phoneCallEnabled: true,
    emailEnabled: true,
    avatarMask: 'circle',
    smsEnabled: false,
    redirectEnabled: false,
    feedbackEnabled: false,
  },
  type: 'agent',
  owner: {
    $oid: '657f565c539981b49a39d5a1',
  },
  customFields: [
    {
      iconName: 'instagram',
      value: 'leonardo_miraka',
      _id: {
        $oid: '6660ccbcb8b2db11b861fe23',
      },
    },
    {
      iconName: 'linkedin',
      value:
        'https://www.linkedin.com/in/leonardo-miraka-20b28a19b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
      _id: {
        $oid: '6660ccbcb8b2db11b861fe24',
      },
    },
    {
      iconName: 'facebook',
      value: 'https://www.facebook.com/aldo.bhoo',
      _id: {
        $oid: '6660ccbcb8b2db11b861fe25',
      },
    },
    {
      iconName: 'globe',
      value: 'www.notifyapp.it',
      _id: {
        $oid: '6660ccbcb8b2db11b861fe26',
      },
    },
  ],
  createdAt: {
    $date: '2023-12-17T20:13:17.069Z',
  },
  updatedAt: {
    $date: '2024-07-21T20:43:08.639Z',
  },
  __v: 32,
  colors: {
    background: ['#F7AE32', '#8B5CF6'],
    elements: '#F9F9F9',
    useCompanyColors: false,
  },
  address: null,
  redirectUrl:
    'https://profili.notifyapp.it/profile?p=66047289d430a9dccdd7afc6&s=url',
  noteOptions: {
    showTitle: false,
  },
  note: null,
  profileIdentifier: 'nardi',
  advancedProfile: {
    enabled: true,
    items: [
      {
        type: 'photo',
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
          'https://s3-api.vps.notifyapp.it/notify-api/profiles/657f565d539981b49a39d5a2/6660cd784dca23b870e0a907/Secondary Logo.png?c=1717713727182',
        showCompanyOnClick: true,
        dimension: 34,
        align: 'center',
        _id: '6660cd784dca23b870e0a907',
      },
      {
        type: 'divider',
        visible: false,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 16,
          textColor: '#ffffff',
        },
        _id: '6660d2dc4dca23b870e0a90f',
      },
      {
        type: 'avatar',
        visible: true,
        title: '',
        showTitle: true,
        _id: '6660b5cbb8b2db11b861fc3b',
        textConfig: {
          enabled: true,
          font: 'mplusRounded',
          fontSize: 20,
          textColor: '#ffffff',
        },
        direction: 'vertical',
        label: 'Leonardo Miraka',
        sublabel: 'CEO',
        useRoleSubLabel: true,
        description: '',
        imgSrc:
          'https://s3-api.vps.notifyapp.it/notify-api/profiles/657f565d539981b49a39d5a2/6660b5cbb8b2db11b861fc3b/WhatsApp Image 2024-06-12 at 00.10.32.jpeg?c=1718183090106',
        imgMask: 'squircle',
        ownerImgCorner: 'none',
        align: 'center',
        imgSize: 100,
        imgFit: 'cover',
      },
      {
        type: 'divider',
        visible: true,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 16,
          textColor: '#ffffff',
        },
        _id: '6660d5354dca23b870e0a916',
      },
      {
        type: 'contacts',
        visible: true,
        title: '',
        showTitle: true,
        _id: '6660b5cbb8b2db11b861fc3d',
        textConfig: {
          enabled: true,
          font: 'poppins',
          fontSize: 24.5,
          textColor: '#ffffff',
        },
        direction: 'horizontal',
        style: 'outlined',
        items: [
          {
            icon: 'phone',
            caption: 'Telefono',
            url: '3240552651',
            visible: true,
          },
          {
            icon: 'mail',
            caption: 'Email',
            url: 'leonardo.m@notifyapp.it',
            visible: true,
          },
          {
            icon: 'whatsapp',
            caption: 'WhatsApp',
            url: '3240552651',
            visible: true,
          },
        ],
      },
      {
        type: 'links',
        visible: true,
        title: '',
        showTitle: true,
        _id: '6660b5cbb8b2db11b861fc3e',
        textConfig: {
          enabled: true,
          font: 'poppins',
          fontSize: 22.5,
          textColor: '#ffffff',
        },
        direction: 'vertical',
        style: 'outlined',
        items: [
          {
            icon: 'instagram',
            caption: 'Instagram',
            url: 'leonardo_miraka',
            visible: true,
          },
          {
            icon: 'facebook',
            caption: 'Facebook',
            url: 'https://www.facebook.com/aldo.bhoo',
            visible: true,
          },
          {
            icon: 'linkedin',
            caption: 'Linkedin',
            url: 'https://www.linkedin.com/in/leonardo-miraka-20b28a19b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
            visible: true,
          },
        ],
        openInNotify: false,
      },
      {
        type: 'lead',
        visible: true,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: true,
          font: 'poppins',
          fontSize: 20,
          textColor: '#ffffff',
        },
        buttonLabel: 'Contattami',
        fields: [
          {
            name: 'name',
            visible: true,
            required: true,
          },
          {
            name: 'surname',
            visible: true,
            required: false,
          },
          {
            name: 'phone',
            visible: true,
            required: false,
          },
          {
            name: 'email',
            visible: true,
            required: true,
          },
          {
            name: 'acceptanceMessage',
            visible: true,
            required: false,
          },
        ],
        style: 'filled',
        _id: '669d7160a799f54993ab6c80',
      },
      {
        type: 'divider',
        visible: true,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 16,
          textColor: '#ffffff',
        },
        _id: '6660d2d64dca23b870e0a90e',
      },
      {
        type: 'iframe',
        visible: true,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: true,
          font: 'poppins',
          fontSize: '14',
          textColor: '#0b0b0b',
        },
        url: 'notifyapp.it',
        openInNotify: true,
        _id: '6660d2f94dca23b870e0a910',
      },
      {
        type: 'links',
        visible: true,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: true,
          font: 'poppins',
          fontSize: '20',
          textColor: '#ffffff',
        },
        style: 'text',
        direction: 'horizontal',
        openInNotify: false,
        items: [
          {
            icon: 'appstore',
            url: 'https://apps.apple.com/it/app/notify-italia/id6479890530',
            caption: 'App Store',
            visible: true,
          },
          {
            icon: 'googleplay',
            url: 'https://play.google.com/store/apps/details?id=org.notify.agent.client&hl=it',
            caption: 'Play Store',
            visible: true,
          },
        ],
        _id: '6660d1614dca23b870e0a90d',
      },
    ],
    pageSettings: {
      backgroundType: 'image',
      imgSrc:
        'https://s3-api.vps.notifyapp.it/notify-api/profiles/657f565d539981b49a39d5a2/background/Black_and_White_Portfolio_Photography_png.png?c=1717713713818',
      fill: '',
      gradient: {
        direction: 'vertical',
        colors: [
          {
            value: '#000000',
          },
          {
            value: '#000000',
          },
        ],
      },
      textColor: '#F9F9F9',
      align: 'flex-start',
      padding: 0.5,
      verticalSpacing: 0.4,
      font: 'poppins',
      fontSize: 18,
      redirectUrl:
        'https://profili.notifyapp.it/profile?p=66047289d430a9dccdd7afc6&s=url',
      topPadding: 0,
      hideContactSave: false,
      useCompanyTheme: false,
      backgroundBlur: 0,
      backgroundBrightness: 100,
      contactOverrides: {
        name: '',
      },
    },
    requiredItems: {
      feedback: '',
      avatar: '6660b5cbb8b2db11b861fc3b',
    },
    _id: {
      $oid: '6660b5cbb8b2db11b861fc3f',
    },
  },
};
