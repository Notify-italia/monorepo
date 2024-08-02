import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  EnumNotifyAPAlign,
  EnumNotifyAPBackgroundTypes,
  EnumNotifyAPContainerStyles,
  EnumNotifyAPCorners,
  EnumNotifyAPDirections,
  EnumNotifyAPObjectFit,
  EnumNotifyAdvancedProfileItems,
  EnumNotifyUserType,
  INotifyAPAvatarItem,
  INotifyProfile,
  UnknownType,
} from '@notify/interfaces';
import {
  ProfilePlayerFactory,
  ProfileViewComponent,
  TailwindFormsModule,
  UploadComponent,
  UtilsService,
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
  providers: [UtilsService, ProfilePlayerFactory],
  templateUrl: './profile-builder.component.html',
  styles: `notify-tailwind-input {
    width: 100%;
  }
  
  .randomizer-button {
    @apply w-full font-bold p-4 rounded-2xl backdrop-blur-xl bg-white/10 flex justify-center space-x-4 items-center text-slate-800 text-lg active:scale-90  border-opacity-0 hover:border-opacity-100 border border-slate-400 disabled:pointer-events-none disabled:opacity-50;
  }


  .editor-feature {
    @apply rounded-2xl p-4 bg-white/10 backdrop-blur-xl border border-slate-400/50 flex flex-col items-center space-y-4 w-80;  

    h2 {
      @apply text-2xl font-bold  w-full italic
    }

    p {
      @apply text-sm 
    }
  }

  .feature-column {
    @apply flex flex-col space-y-4
  }

  .pulsing-dot {
@apply flex w-full relative items-center;

div:nth-child(1) {
    @apply size-4 rounded-full bg-current
  }

  div:nth-child(2) {
    @apply size-4 rounded-full  absolute shadow-md shadow-current top-1.5 left-0
  }

  span {
    @apply ml-2 text-slate-800 font-medium  mt-1
  }
  }
  `,
})
export class ProfileBuilderComponent {
  public utilsService = inject(UtilsService);
  private _profileFactory = inject(ProfilePlayerFactory);

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
      case 'influencer':
        return this._prepareTemplate(PROFILE_TEMPLATES_INFLUENCER);
      case 'squarehead':
        return this._prepareTemplate(PROFILE_TEMPLATES_SQUAREHEAD);
      default:
        return this._prepareTemplate(PROFILE_TEMPLATES_CORPORATE);
    }
  }

  public onSubmit(): void {
    const templates = [
      'corporate',
      'chill',
      'grunge',
      'influencer',
      'squarehead',
    ];
    const randomIndex = Math.floor(Math.random() * templates.length);

    if (templates[randomIndex] === this.form.value.type) {
      return this.onSubmit();
    }

    this._loadTemplate(templates[randomIndex]);
    this.showProfile = true;
  }

  private _loadTemplate(type: string) {
    this.form.patchValue({ type });

    if (this.utilsService.isMobile) {
      this._profileFactory.create({
        profile: this.currentTemplate,
        isRunningOnPlayer: true,
        hideShare: true,
      });
    }
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

const PROFILE_TEMPLATES_CHILL: UnknownType = {
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
        sublabel: 'Web Developer',
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
        style: EnumNotifyAPContainerStyles.Outlined,
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
        style: EnumNotifyAPContainerStyles.Filled,
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

const PROFILE_TEMPLATES_CORPORATE: UnknownType = {
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

const PROFILE_TEMPLATES_GRUNGE: UnknownType = {
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
        type: 'lead',
        visible: true,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 20,
          textColor: '#ffffff',
        },
        buttonLabel: 'Riservami per un evento',
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
        type: 'avatar',
        visible: true,
        title: '',
        showTitle: true,
        _id: '6660b5cbb8b2db11b861fc3b',
        textConfig: {
          enabled: false,
          font: 'mplusRounded',
          fontSize: 20,
          textColor: '#ffffff',
        },
        direction: 'vertical',
        label: 'Leonardo Miraka',
        sublabel: 'Freelance Guitarist',
        useRoleSubLabel: true,
        description: '',
        imgSrc:
          'https://s3-api.vps.notifyapp.it/notify-api/profiles/657f565d539981b49a39d5a2/6660b5cbb8b2db11b861fc3b/WhatsApp Image 2024-06-12 at 00.10.32.jpeg?c=1718183090106',
        imgMask: 'parallelogram-3',
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
          enabled: false,
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
        type: 'iframe',
        visible: true,
        title: 'Visita il mio portfolio',
        showTitle: true,
        textConfig: {
          enabled: true,
          font: 'poppins',
          fontSize: '14',
          textColor: '#0b0b0b',
        },
        url: 'brunomars.com',
        openInNotify: false,
        _id: '6660d2f94dca23b870e0a910',
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
      font: 'bitter',
      fontSize: 20,
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

const PROFILE_TEMPLATES_INFLUENCER: UnknownType = {
  _id: {
    $oid: '65ca137c4f774a6d762049eb',
  },
  name: 'Luca',
  surname: 'Venturi',
  email: 'luca.venturi@squarehead.it',
  phoneNumber: '3913225127',
  bio: "Passionate about design, innovation, and all things tech | Let's create something beautiful together!",
  avatar: '',
  role: 'Creative Director and Branding',
  config: {
    whatsappEnabled: true,
    phoneCallEnabled: true,
    emailEnabled: true,
    avatarMask: 'hexagon',
    smsEnabled: true,
    redirectEnabled: false,
    feedbackEnabled: false,
  },
  type: 'agent',
  owner: {
    $oid: '65ca137c4f774a6d762049ea',
  },
  address: null,
  reviewRedirect: null,
  colors: {
    background: ['#8B5CF6', '#10B981'],
    elements: '#FFFFFF',
    useCompanyColors: false,
  },
  customFields: [
    {
      iconName: 'instagram',
      value: 'luca',
      _id: {
        $oid: '6667702a3d23e2840f0f4f8b',
      },
    },
    {
      iconName: 'twitter',
      value: 'luca',
      _id: {
        $oid: '6667702a3d23e2840f0f4f8c',
      },
    },
    {
      iconName: 'linkedin',
      value: 'luca',
      _id: {
        $oid: '6667702a3d23e2840f0f4f8d',
      },
    },
    {
      iconName: 'freelancer',
      value: 'dfsf',
      _id: {
        $oid: '6667702a3d23e2840f0f4f8e',
      },
    },
    {
      iconName: 'googlecalendar',
      value: 'intagram',
      _id: {
        $oid: '6667702a3d23e2840f0f4f8f',
      },
    },
  ],
  createdAt: {
    $date: '2024-02-12T12:47:56.655Z',
  },
  updatedAt: {
    $date: '2024-08-01T23:45:52.964Z',
  },
  advancedProfile: {
    enabled: true,
    items: [
      {
        type: 'feedback',
        visible: false,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 16,
          textColor: '#ffffff',
        },
        caption: 'Valutaci su Google!',
        icon: 'google',
        url: '',
        style: 'filled',
        _id: '666773f08af5f85fdfac56a1',
      },
      {
        type: 'avatar',
        visible: true,
        title: '',
        showTitle: true,
        _id: '666770383d23e2840f0f4fa6',
        textConfig: {
          enabled: false,
          font: 'rocaTwoBold',
          fontSize: 22.5,
          textColor: '',
        },
        direction: 'vertical',
        label: 'Luca Venturi',
        sublabel: 'Travel Blogger',
        useRoleSubLabel: false,
        description: '',
        imgSrc: '',
        imgMask: 'hexagon-2',
        ownerImgCorner: 'none',
        align: 'center',
        imgSize: 100,
        imgFit: 'cover',
      },
      {
        type: 'contacts',
        visible: false,
        title: '',
        showTitle: true,
        _id: '666770383d23e2840f0f4fa8',
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: '18',
          textColor: '',
        },
        direction: 'horizontal',
        style: 'outlined',
        items: [
          {
            icon: 'phone',
            caption: 'Telefono',
            url: '3913225127',
            visible: true,
          },
          {
            icon: 'mail',
            caption: 'Email',
            url: 'luca.venturi@squarehead.it',
            visible: true,
          },
          {
            icon: 'whatsapp',
            caption: 'WhatsApp',
            url: '3913225127',
            visible: true,
          },
          {
            icon: 'chat',
            caption: 'SMS',
            url: '3913225127',
            visible: true,
          },
        ],
      },
      {
        type: 'note',
        visible: false,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 16,
          textColor: '#ffffff',
        },
        note: '',
        showNoteTitle: true,
        _id: '6667733c8af5f85fdfac56a0',
      },
      {
        type: 'links',
        visible: true,
        title: 'i miei social',
        showTitle: false,
        _id: '666770383d23e2840f0f4fa9',
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 24.5,
          textColor: '#ffffff',
        },
        direction: 'horizontal',
        style: 'text',
        items: [
          {
            icon: 'instagram',
            caption: 'Instagram',
            url: 'luca',
            visible: true,
          },
          {
            icon: 'patreon',
            url: '',
            caption: 'Supportami',
            visible: true,
          },
          {
            icon: 'twitter',
            caption: 'Twitter',
            url: 'luca',
            visible: false,
          },
          {
            icon: 'tiktok',
            url: '',
            caption: 'TikTok',
            visible: true,
          },
          {
            icon: 'youtube',
            url: '',
            caption: 'Youtube',
            visible: true,
          },
        ],
        openInNotify: false,
      },
      {
        type: 'place',
        visible: true,
        title: 'Prossima Tappa 🛫 > 22 Agosto',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 16,
          textColor: '#ffffff',
        },
        address: 'Sa.Pa',
        civicNumber: '',
        city: 'Vietnam',
        companyName: '',
        showStreetName: false,
        zoom: 4,
        _id: '66ac1d197f326a03742dea5a',
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
        style: 'solid',
        height: 1,
        color: '#a8a8a8',
        _id: '66ac1bc87f326a03742dea59',
      },
      {
        type: 'contacts',
        visible: true,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: true,
          font: 'roboto',
          fontSize: 12.5,
          textColor: '#ffffff',
        },
        direction: 'vertical',
        style: 'outlined',
        items: [
          {
            caption: 'Richieste Commerciali',
            url: '',
            icon: 'gmail',
            visible: true,
          },
        ],
        _id: '66ac1bb77f326a03742dea58',
      },
    ],
    pageSettings: {
      backgroundType: 'image',
      imgSrc:
        'https://s3-api.vps.notifyapp.it/notify-api/profiles/65ca137c4f774a6d762049eb/background/papers_co_no59_summer_vacation_ocean_sea_nature_beach_blue_33_iphone6_wallpaper_webp.webp?c=1722555045155',
      fill: '#fd0839',
      gradient: {
        direction: 'vertical',
        colors: [
          {
            value: '#8B5CF6',
          },
          {
            value: '#10B981',
          },
        ],
      },
      textColor: '#070618',
      align: 'flex-start',
      padding: 1,
      verticalSpacing: 0.7,
      font: 'caveat',
      fontSize: 25,
      redirectUrl: '',
      topPadding: 5,
      hideContactSave: false,
      useCompanyTheme: false,
      backgroundBlur: 6,
      backgroundBrightness: 70,
      contactOverrides: {
        name: '',
      },
    },
    requiredItems: {
      feedback: '',
      avatar: '666770383d23e2840f0f4fa6',
    },
    _id: {
      $oid: '666770383d23e2840f0f4faa',
    },
  },
  noteOptions: {
    showTitle: true,
  },
};

const PROFILE_TEMPLATES_SQUAREHEAD: UnknownType = {
  _id: {
    $oid: '65ca137c4f774a6d762049eb',
  },
  name: 'Luca',
  surname: 'Venturi',
  email: 'luca.venturi@squarehead.it',
  phoneNumber: '3913225127',
  bio: "Passionate about design, innovation, and all things tech | Let's create something beautiful together!",
  avatar:
    'data:application/octet-stream;base64,UklGRuxGAABXRUJQVlA4WAoAAAAgAAAANwQANwQASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDgg/kQAAJDsAp0BKjgEOAQ+tVqoTycytTAiMckyoBaJaW7Y2hjk9IxEw/6ZOxaiPQ/bevNzv+y8t/sabeZTz9PPm/XNpkOZxc/XwBq0V+8XP4l/7/Rl8g/3P/3/yfO34f/+f7b2ms2fwX/p5+/2j/e5eGsr29nO8vwYrb+bHKeWCmQEkdzqkko3NsvKbOqTffA7nVJJRubZeU2dUklG5uZna/vCl5dk7Xvbqugpu4SA+3+fbr6/0SdDHEWPYIj0xw+c2doXQqUbm1YWXlOq7mI4dyfxEp53Vn3p62t9JXQDWWHOUe7heOUE2Y2SofVBu0Qf9uONt/X+35K9D/wVDiLKhKQGKHeNwlBFO8y6fbWGqumAikY//o7RedZO0JAqjDNC1YzQVPvHCaliXKRThArn0wBqg7zSCD9CsxihXS4Kvo+vYb4N1TYDahfVZgqOKekHEaABxZjrZjaaRBy7xtnVJJRubaBTepxzosRnVOTP9wSGQtpfYe8QojpN47OHKU3DDGUNTAyZRAPe4t2Wn1g5e5RNsxLyKKDyysRjRWDc7ikas2C9BuQCMsaF7OMYZJukz0i7CegXlo6rSekZqwhB9V+2CzjuDFkMpcf22B9En3iYqLuZ65qOtpoTkAODVy5Lgdu9HcBKten11TG+mc3/ylipKJUj0QdkSp/GhBSk4S5QEnJlhrK4u7b0I0BCCsMSvgiPsmc1o0UIUrNEheLs+POcR2tpWhYjfCMadC52i1hxMmNQ+v6+Ml6IZyX8H5PHWX9BVjIm7ZzEklG5tl5Tb+v5DaJI7y/Bnh1IV5X9OS4hRh8CkkmlB852QZYnyv2MVnWm/OBT0+vGkiRCW2b4FKiJk+WTkakCJVz8EZ2AXbeOfi2lqTxEUOcy5aeYurjE5W2Swz9jBX27JTtbATE93EXoDrRAUrvNbw3ddhpnAQP27kygwMkLpVSm7nL6Ju6OADrm2xpwYrTMfTJraep7QryN6LqxziotacCS3Zq231JXM6kA/vKyikq+dynOikOCFBS9n7wYQI4unsQI9kJM5qSalGOVzS2okVeuAolNFHQGX3ERgpJ4Wwl7MFrH3LJzDQJ0URP+QU/dEz51VzJZL+gx6culzL6OtVXptViy8ogi1TrlVW8HB+qJERcAfcgJkiCTMD0np0koXxf/wCgzmFZJmOSS9B0FZ38j5Zfw7iDJfci8iZ5cxNV0AxHil8dVtId3eVIx24VJLs2YCrO2N5QjGZoqa2EVuEggr5DZwIBbzYHjyMxKN4Mf8WYeOLG00BxkdZ3OqSSjc2yGvLSqYlURvGpbIe6wT4z1pY6448m3APJe5HFXDWGLb/dODXDIYXsX+WRIWEQ87h5n8MRxg+iY29eSLGeVK/Jbjv5/TEyhDgDR7hUYwKF4cyI8k1jMWQxIBn/GQjrZi9UoKi7o42zqkjpbZBr2QJ0MBoXTTBm+/V76XUF08zHGU2+VhgQ7zbL8hHKzVHYINwxEFvh5c16YXLVspljU7jMoQuxvWQvlHUhhqHqcKVYCHVHJNaFiyeuWf/Wge1psRbJTI7Jk8vyiPeNs6ol6Z+3+f5k+xIfn9qhHBG7yF7wtIYe1ZoWQB7yWiGAaU+vKicAeGkJWwqp5L1+/cSMvB1EK24zWoRXPsP+NLLwCiYafDIO/HslQ9YdkM6HvGYQ2s8FUt3oY/wJrVJUNf6CouNr48+Y72f8nWGClEppx0C3do4506vaZWici4v+pGkQXnWANLq1oOwsPmlJNhwmUmffBvWYMhWpC0zDf8Q1Dh3OqvhQvHIY5TKbJTwOwUnXNQAZkbP4AoWpKXyqa7ewBYGn2wAmTbsoQcKzFbD0h5g7i4sfbnk5IKPlv2X85YuIqmkm2XlmJR2jtTdhl5TZ1SSUbmo7YNqBD1SiXBGj4RRoXBT+bOyJogNg+eI/ifOuKS5UkUaNzjnvUhEFFwGgqYvUb19kHqy/pHUddXkxobOqRpVaXQWgSq+IEXvMFjx/DEhQaz98XbjV8GtU0OxferkDAKeiKhNLj1vxg0Lxxtnb9w/qzwO5x/hclPVMRMEObHzu7pBifCZ17LYcP8crN2eEPBoP9eJFnaDQe+g35izXUSSjc8OA7nVJJpcZ/Zc9LHaC/VgT5pVfS9ILh3fV2/O8zVcMeK/M4SU6jcLzkh6apdyYBroEx720JdvCRfPNzSXjQMThW/oSAyiDEiRc7FNGgxUWy9VRHzzEo3Nsv+BTZyIVU9Dups9mAJYOs2KPyEF6ZceJwWOtAnjk/TdtwrK5/5HNmXukJY2yTebC1fxOnvBsdLS6dJvXM5VICz1T48PsPG4BbWt7z5xFPEgbYaxXjJYaATbp0DM7WJE6zfGKB7x3NRUymgRxhSUbj+nGyYihT6deSc1gYL9SIqPrPdkTo7L2cSNNaTJXqHGFBS40KquH3okrx/HDxFXAhgWA4cseMpjHyxRh2R6KzMhF83bpQ3UEwo/8dTNylmJofG2gXyf7cuhPVRU2dUks/8pGN9/SDTCbb1o9HNCSdspqie59+53zCoymu9eMZXp2zuxvF/YoA2hOZ+e5uV65CJQMhWmZX/UKGhm+8cZ6r6M0gE9fvp5FggWjZwMI6B+OCjnAKLkt9aaNfgZ+yP/AjClT0muaWzLp7VdibMGyf3kN+I7lNnVJJRv1Pj3ehLoh3pgimaWGXFhNfsxTkdFV3/WA8PgElq2siYo4EkbYCn5kWN7lBKBfAG6k5tKKUhd2HXczrXtK/pbcvgTmkE58VGdLFmMRordLQ1NZElx2FKLzPUWeobabJZhvGpIVU8hIpcABGlHIGi30TpS/elIdQA+fX9TZEnvH5Z7GhA8eII8QQ3jVJJv/IZMnoDZ1SSUbn+Lyt3MgfG38jmvIo2rnkxgfBiMx69mXENSKlDbKYV8GWacF6AwI0fNJud6ltu8hfS9+sKH5I/OheEi0d0eQ6UwlZOEPuW6BJvez4Menngx/llcxFrG0XCmU9ubD/wSkL/DvG2p2YfOqSW5l9X+grKoBLA2IqsGwfcjH8O7/Wy7UeXzLr3AWRn8gZfkLdaBz+Am3zPWg95WK4Oy/yxFGBa49UPMsH/m8XllG4DSaKZbd152+2XlNnW4FaGzn5nOhgoOjvVPsXMFPdm6P8ru9vUObWT4VMpjR1vWB8Zdb2FYBPqwt6tAuaPeQxKbI24JMGhC0jv+3+kZNslyz+8YmTV3ijL3OEnn8NzYxr74PV2qGrlH6/q4siPZBo4SF94tk40pgWn1w60dnT8J2UXtDnmmx66LyS16aqjDTGcX5Jy5toLvMumHRjKbOqRpVSjiiijBub1Z0uiky6IfR+QLZvQGhwkOiPlo7DzntKqX7GgatxKt1Sg4Ytmu5UciVOWn8AV32VsaQD/GoLYNYw8f+Ze7QooDOcBnWG4Dexcio45gcO51uqp/6bblzw4cJcaRL4MSdEKJxWU5GGNd4wnrhFYbEB5p9tJ8TRn1OwSNjKKbA3hHg+SJsSWf78x/3s0TQtjU2816SkvuSoiChPPo5r+d8mehq9XTiW5rMW8qEklHFJG4rxxtnVJJRubZeUOF9bm9D+VcDMTzS81sSIZiRq/Wpny2oxxl1CM6KI1D4iVap71RrFoKWUYtRDETmPjD2BRwUfvzrRxRV/8E+KOiOe34oYcuba4Fjsds6pGQDiN71DHLodf/MLVF798thHji5Qkk7X/9gy4jk3Mc6UJUEwoqNW0JlhGUfU6kByjCeC+h2YA3QrCQuTYsOw/fF/E7ogrvHvtlz0sbY69BPKOinR94E0G17OfXpS+LOWKh9lshP7GFWvGyrq8pharLtKF+07RjQdtzxG1h+q+ugvhP+Z6qp0Mhu6Bc2GcziniONCqhoZlxJ0Unvsp2FAzg7a3D2pXXOTHcdTe9d+CUbm5jk5lxsqEo3Nqwsy1l+y8psem4T4u73UhBcH4bzKpMzM2Ud0bx6FHzwwee65IRmDdYvdXbHsLHekG6dUvA9IjzMeYB0vlXrt/z5Fn90y8TQ3PSJ2yRm3HbxYDqQzCPL3D1bSsD/qLZfEPwO53AKtNtt7MI4qrxhaN62K/dTX/y6jNP+wgcga30WWu+18RP/i9a3OjD9kZbXE9+ZnnxvghWMf8WYcMMcblNnb3Z/hZqlvtv8tCBIl44+Z/uiFWNQ4v5hBMBXSUWbH4wb9MHlpSkNRVPXcfqlYd6BkLk2npzjliZ+3+kiEhzU0d9j+kFj1US80IiOUukQO0Q7Xd20cCVzX2l50c+L7KQBgSflgq2vQFeKA3jVKZIPOUlfJn2nJf0FcNZlPbk9J4d0DNsol/9OsO+LNkpNsW2KwYLBB1DPuCyU1aprSqfY5FKeKbHjNxLwnK9m9vKcKWVLT05bqOBqJGcqt7ooB31nYbjVELh0BLUhYr4jPu3yEnHrHSpc5K1lPn/SgdSfH9Al7Ns63DVIfsvVTE2SOcl6D0XsLcucJ6q5Nh7UrgeK38rh0HcmIvxp+KIdi2QsrKmNh8U5hQUyVUDfTdRkOgNFmAxVQcGynn0xNIfyNLJn6KyImOxFsvKbf16XQpJw93waq2vmXasML7aj37hGyD+l32NXHzYQrFSeanp7WFre97tjaiZQNnvYCDzjr5Riu7/+MmTy7mw0SbgSzXD0xIzu6oHc6pJKNzwdVjOB9Ol7O2Y4aXGeImedIKq+nV8HkdzwTsulUvbBhe95tq8nF7GTkMQPZUxRXjjbguUwPb9Uk0V/oO6bLymzsD6CqlUHwuv8WNVScA70uYHy06vWSQQzluQuq0Z1gT/6ZHEvG+uyR2orDP9ESGhoTn/GIqoqr2/CK+dd/oKi2XlNnE/lHZOaqIjTE7xTyTBkGOOpnSYiuP7lHRnZAAN7mlgyJQXY6XblpYmJTRFTdOj/VHbZbk2JGDFiZ+4Aqo+E/WD4HF7MTTz1XQz8nVuA4jXiwIoVQoeQlKPt5vf+GWNQ/lP3aZoJkMkPVudEdxh/7TGTIw8DudUS9WduP3yTItjN/tleyLLwgCH6nbLUgkqaaonR9RAn5ghMUa6oEAODukM1FYKky0VmlyC4Dc7KkzM2S3CZmOZn6K1oEFylDe8TZ1uBNnVJJRvmtWfTvrc28VUoGlvA9elH7f849WMrlk2XDkDtEQl5K+zzxCwXEjUSnYrywgterwf82ok1inXgh4MdRs1IstSqKtmXumU92C8ue36o7P3AKY/b2FCG0fHsFpCwb9J3JJjzXEdY7Cl7PLzuYKPbq9gIekXgjiTDM4GLcDreSoAXvKY59maY73TS0dHuRXpS6ELgTkqFeIPGCE8CH7P/giSYmiOe3bC4BTIM1xpWbGsnpi68dcl9KCD0fQC8GkwIQVo8fxeLlJWsGMgB40qvQ0aCEVm15OzAga3jnO3saROuSr8LyhTrJ03qjTcVJQ+822gl7g8nQOnlAysdhTS49gvCYlG5tsFA5aAbkmr9TnQP54eKh9s/PiukePXPoIQfaVbp4fpa9gTu7yx7pVNyjY5QXu3UPiJ3Z520J8y8I5VZqrYWJCvSGFxPtU/N2yjEO+EBqCVzTPlLBHay09MCwI6XyZNp42dUMxjBhDHArZKiyd2sKH84NX3bQtpgttrSnEjUxAT3XVvXvXv0dBEmr2x+RrRcP1oNmz+kw0a9F2/sjM8/VakKO9UUaTfRm0+yM4B8TV/WIO8L1o6A6VapZaIAPEKbOy58YyHRr78sp03QLmxmqeZvSwD+GNNYWnkAL7euCvRVzIbHEKxBdKC3YijfTntNCgULvMM/GTBPqL+2A0hgxNFEkomFQ650cTL9ki87O3GvablAXhjwD6NJiANf5Eg1i9JojuIV9BOIW4YPXV1By85Czfd1AUN7fJoKl+VsCne7WeXu9getPpEUSSO2uXY/R5dXxOwO5ymIUN0oxKpeIWrglih5IWZhjx9xJmLFrSqc8Qm5Wyue+pb6hPE27P2lhQJrStjk5jdYjfGZFJsD0Z9yi9AVaN7bjVzAiNkZR5GmdkoRaOIGQvc3bsKCljDFF0+ecxVTSlEEa5Vv8Csj5tRIgAiMetiXx3oamCB5oCtUkWD4bPk1PO1NmDOOarfJgZw+5fHwDKmXMNJJLjOmnFkoMZ4+csgzgSWAvqSSf28QXDidsprtI1crHGjs0s4xSXESXKmofwQrWilCTiJcIWUswPp3gWwxD2oOPdFtroyVHIJP668mmn25cy+gMMLzmOvpmAGE0KSNj6+nbdflAsNdPHVL+SRSyvYgNRZtp+cnvOHj6sZYrAm5iGi7J4ZNPfFNStp8Y4K/vUwSc87mUuehcMAOdgY4d7yb5iMGWWfCxYg6bI4IUzipby2m0pGRv8hLjxFthpIOQWMO28MvmMdqpdCaMmXAZHbYGt/4LGlL+DfvNLrcuBmJ8vc9SwV9Qky6h7MtNFVcZJ8cfRVWSVbwQqnZl4a3VpCtMIQcz0PG/6Gn4LKbJswIQat6aqAqsIhB73ri4fpP1dOQnlNcEfMedJeJzj9EhIheR6C4qV9U4rnLafeG2QxqoStmy07pmZRybbaWtAnsTE7R7nky/BnfjCLFSeHTaIPpIwWm6SchvuFMFE6DqL3JtG6BN8Q41dOqQAgMpLbJRsPTMLMJIGHp7xla/QjVOsAkDd8FmQPPJ7JQBuak7arJXjFFECIyXKzrYhZAgU3BG1uj649sUoDmS2yfuCb1AHMaheAK3dWhYNtncpsdchMKeUneMYgxDw7mLQxvmGSxBXoaJOk5walySm17VPzCQkbQz/HDQqBpuMeNU3AR4CglxkW2Q2crb6KIH8niX6o+8NlowQYlu7ENlOSSpa8VG4WF1UBUokdFXsAGIkw9PRzzEnZp6Cxr9APLiK6V6PgocwGB39ydAu6yeRo/jHnhrmf3OV6FGT6c3zY6DNRTfXQgn4OI7Yv7yLXfrbc+ltUL63HlnOLoPhiX6QU1nV0fpA6fMiNKCylNL6UtIkRj3ynqMv9HFt6Aktg8BJG3hoyCZAg7yyNwFQaoTFrk3dAQd4AHxAnceXvqh1t79yINZvV7qnF3/rRVJ/++HKmME2u3oVyc121WL/nsfVnA5Q2IUsSnxExSrs1a93OmEh/Kz9SuODOUjJIN98U5NB5/u2BgLcrl6iTQSniu1JvxWTTRltdeNakO9TlnMmbrqFous2t77qdpWixfL2h4G7kONCiaHF08mNZ9BDkNuG2Habm1E0jaOj/lNZkzjUYePYVaeH7nxghCwh0vHkdjmWXsHV5GtstnFgr0OIgAounvQh7w97eiS6OX7L0Huq5zww5yW7tYD2kLHhiepixcK8ONyE5lEOPvPYmcorNuNhlqk0KoUG/TVQcyHIQsdKDqYV6K8w2LgfztaufRJEAH+l4XJLs9Lw8OGwszQDcK6hCHYnL/H0a1Hr4B4u2nvjCp8kmbtJSoBU1LKwNkWrC21GbXVrFyxZGBX7B0NjktnFgCxo40stYNVXIeXWPJuMB2JeTVUvy/7ifRXYxi7McWXYiCinAk6+3uFwlJM8o8lRuqPa2blbvgJ7mylXGac9di11DPYSeQRgTB50zxpjZLsiZzu7gWrI0ttOGMy1CIhKqkOl85Oosx+wOXVYTu2U2WeuGuG+S6TbwIwZybvbhhJo3jfCBZnpC58p9oFP2VZyfHm8sAUbF9O8yBjgntzbFvUGVttuAu1s28Hfm+TNy8HUmZAeac/8uMlu0kb5u9umZX/WkD4mzRKBXuOmx3kDZuhJGx/T3CzrmduGENWZmZP5BeHlvxwUkfJSrMQfAqrsUJLNjbHwnFWY2XPsHW+WDmIjwEiXAzLhr3I1OfKtlUOIGGLMH6BXObFXb9+gNbjijabto+8xM/2jJj44I44PR9wmguQtFHEAuBPacUI7cXUZfWgCnwPb5ArMQt2ig/KuQlbxEEED6H6H6vwi7jKLg4gSYIlRFWfMZunrrR1baOybFjShg7lYu9kB0F2QsyAuFc6QiiR4ir20d4YVwflC6lVrjos/tVY+aIq6AD+66z/EisLerfi00H3r5H1CFcUnVfSA53TFz65AF35YLIzmnFSSMFEN04ygUGITE6qGpsDVyhiltXTVs/UIedgXl97hHDH84VCkvDeh+3J4acY4/tNlbM8K8UXB0OQqXinxOG6rJgAAU4AAA4UslyRXfgD8yoovCF46Q8dlCVdJotf+hedn6Is2flRPsr5sWFVxH5udM2WITmD9jgkES+v6G+fBsKSFAeS3xH5pZR2cqjTXwst7pz8fMegCDmSLEIXVMILMwFtLMYD6iV0oV7ahQfLHMeZdjMMnWe4TN/wAIjNwcuU1WBMScDeg8hYIruG8G+vHn61pvubplHm0HKLicVp5mrwT5r6JLSeYK7m5leodQqAOzwpEukOxyBsUwz6J9DAu2YppRd/q4kCb3nG1gOipbhHrHLPPJKhDrWw8iAN7zPGG/POIhAePCYZmIGWs1wTj3UaJPqenDzRV5LYhp25qcVdB8C3zFL4dS9bKtHMNA3JSWb4aTolHshn5PHUr0fFaY2xV8gAAgmexilQL8AAD7v5evmjfSlmQLqmRLIS6JiI6ek+X97/UWolA/GKkxqdquTft+JvU5Z9Tce6XR2T8lWdgO8uapO57FINJ38oPDdIcrtdmTA2bZoBDFBdqqP0m+Vd+b65DtHPOfEtIJvFb7f1SFGLSJdy0C7WZ6GdS0z2Ef35K+qwFB6xEOLNzEefcXRXjyFnNRAWYcIDNe858eXW8ZvDh4ukydSRWAerM0HeKPnx5zP74/ANEVOV/7ZCPqOLPckQBXCt1y9DCXwCBtSBTN0aCqK8KyKKzxxQ09KUH88TewLzVNwVOYLvnjaly7prEhsXIp9P6O8WumbVsWj7DSodY94cpAlrfX6p4BpFdT0mwhKSAW5ZEIMJqgnACJBJm8ZgYtaC5y6HFs8EZ/JUrWGXtHN0FvhxnDth7D1mg8qWaqecuv6qCw2RdgloEYs5F9ob5dlJnCqJEPi0wZ8SD8/jJfMmPkvJUYnam+YTo/JC0Rre6ikXRlQu5spy0XZ/dubRv9QZrD3aC6gwufLyEysaam6pUw4WEr9dP7xDLvLys7oi5cIfE/5GWgfPgUwGvt9hRF8AFSAQzMS/xyZEnDM7PhO92X3Pc9bDGuAkqGQoz7Vo95tAJ0ECdDVLndN8sxv5QzbWoc7i3+3G1WsZ3zjRNXnBVUPhxTUgd2lR+FKbgElZ0gE1oK5/MAFPW5sqZtMZZsskoiBqYGNB7edYJvm6Y6nSRLQqhudD5uIqWkgGmgDxcU/wEIkVjcAw+M+D9W/kPBATv/xs5S3GT1yQM8PNcaeA67mkMbMLp21tfV0bvyIobW4F3ojVlx69zeE0/ei3IUCiJyH5pYiGyLJBab+XG11vTyLf9L5HNNQ97rJECtrogd4OgzeWZ1UBaaL6/WVVTpAok59Bg1HrKz0tbLnCGqQ9TbrpoIDhY9uXqJoABAePED9P3kiz0M2yOcRrRfCXSvQOGPcRJCoDKpNGwjls13QEACGwA7arLZKfC4U01jeNI9S4Eoq594UX2QX0xyaNBGZBdWMLedG7cy+yesPO8CMiwOGoVtsS3rDDUwAo7jvftVg99qIqXSvSBHUH9do4ge50ZcFu063Stb/frkIt/auLXUcM3/in00fiAAAAAL8R5gCekfuhh79tn39SjzXgg/5vvYaHigiB/zP2gzL27eZkSd22SIgY9ApOZQRtE8MbjR2aJcDGLy4gz4rGeassZ5oK6rty3d2jYHcu0pFpPPK3SXCjvkHofZ9NlCr3oB1ptn+GVx0QfjnFdOqF4Aylw8QTcqdNFSUkYeZeX8LDw3qeXY8/jFYsPwH2p7nsywzcwlKaLVOoRbF6ZUoQnSb7PkUzn1tLsCUxnyVm2y+RvvxQEkDecdsDrRzaEWfyWOSz6h+Bs1Ca+BATCsfXTna0xciTD9XBR4RV4tu2ZZ1aV+v+pnd2uQD6ReKxwICzYAAWIr38FlKNWAJIAGMglk1ScAG4jNR2U0KGgpT1j62f1aBmS3FjvP2ceGguvIm+0lQSLK9u6aBpL9E+gGB6XDfWLvVEI2+K62iLDI5qZY/LR7lITN/LQpbv+XhRRkkQC7ikhLERfMvvYNxDrUabCvjzgZUUvqOZkqFRdoTVHnr2W1kMOY5YbBMgwRa5OxWVNjoYyndDT80tY7q3YhBpvIy9DNhdshTjfaILDC90cBkvNCchW1jd/9e7hasXsmCav+IRHKZ9YWazryE7W5jRFJsDZSD7Fmc1S+J2/9QTR7TSSM0ExnIYjYWQHQv6FGw8N5E1D8to06eneICvim0nRvy4O0hXt33zPC/ZcZfMrEI8wPEt9m2XNT2gVSomSYL0Erc7ygoX06cOFPVI6vQtgb3nMlz4EFUrVAXHLxUC7u0KVJf3wRukI9CODe2vlJEGgM/zRNnohjlIq8iVCQzUcKLhWib+WQQKMHIEpo77MlBbPxVkKBFLCfLapZx7sN56Stk5fhCI/STbPKicjoCOk2OId59fr9Bf3CbVBqPOtXXSbu4w1SkCTgHnKEh9z5/a+kAADgcsYBFBAMgWC4u76dFSI8RJKG2Wm/DObMHR/PHAuyplTQqnTRlvEWQ+xpOHxzk4w+EyBIsRk98WsK6rIQeTGFbWDmqsFdYuijQNrkSp4IhnUXq+omoYASD+CFZ/2nQCKJ5qNV5al830yJmZxKf65zsvmg3/Uji/yKzAIimlGiU+pCC5OmNDXf+C4bWWwsbOZiidAOQ8i954QqvUMnSyz2Y16IXmyNOpZk2FiAAYd3xPAEEAEucmRvfxpDxRHCMx1vp05qCFEmcnm+yGKdp74Iy7Y7n5eUjfTjhBQ++LWF/wXwqLsYiMTE3FphovmPfrkPRNSscrWSiLDuL15FHIlu/UFDU2qRcgM9sJZTfIumm8iYF8BhRWa7x73JQb2R2Ydv94r0Hd5HPJM1sWqYogGJbJpkht0F5gICrdUCCSTdSNVk4XD0QAA6O25iyiYAIUYz/PFA+FZzTf+wveGbAv1S1qx02+0Qs5W54UDgyfmtHtMytl8r0wfsulwDr/Kn7pcY6MzITqzq28xCrvPcg1PuOaSiK2F7Z8wdRhvitZ0zTs5VnUUPt63LGDxyLEidO95kDxDjQ1N2H/gRJfNkQ/mv2RUxU/XPTpqJieFbCa9RAObvtn4AxEABDIyel8mQ9SF268cKRmcCRV0Dldz8OkYbELyFctqxh6G5WhMryDT9W1po86ZEMm0iSGiPymuEwmHtSBSKoK0B5EpavK1/1Y4IteUXl5K7olLJ3sk2PCwPpz9htjyIXfJQtCECIYSUygY2saxV46gFpIVrcSdUCBkqZpMQn4QrxZF5SUcxPnk8H738pTIRKpugafPhf0k8Fq4HsktNP0242z4jb2mOccJZNJkaVViI7JVyBPOuQkV1ODhDVpTgElTnwj5g2MpmF51DOcUhVACB+eXcIyBz/aGQFccyK9BTjXU9z5j3SC9aSId6j7NK7zHKLtGs2uG1iwkwaJZP7pau4ZGjqoEHFLeNQOmV+5g5+Ena6nd5D3kg8l7eEvbmPAGjdBJQnVXH58bYHYINB3iD3lDBRBbVzXlhP9PAs0TxVxMMvguubwgGgBZrDyHnQQv4cCYqkf8ujtrY+aaRJTqDWFXL8GNH58PWjL4fS8w6WLf5Sud1NL+CdLQjhPj1LVrAakI/bh3pRIcsUUUWWEMxNFibsPz8sxfKKz0naCpq8BdCSdBeKkgI0AHy5QIdCTKMJcKUe0sE/fG2yNBpc+gV7FS2l8COAn0AeYKrdLIctsPM1M13ds3Y1EjKDxQjAIdKrQpbT+7qIEOLy0H+m8b8v3E2ndWoSESYqNXW3xgVdq7d81QiORaSzEQidd8BoM5Ef9KPBG/CtiEy/ilEX9NqwADodbtNiEZsLA8oCG3Au5P+0FRwDHn6TAoPgcV4J2Z+82DlAbu5k3HpW1VFXvYaPK9M0BghOxG/DoaNdG22bPjmlfrkKjQe20Re+JIeCYBd3cUPCZZBzvKwa9sxyQRWOH60/a5C7S06VE19XIUYoj1kjX7d1JgftrJhb+R+BCg0+CrxiRvDo3A58Nck2mFpfkU9/DQpCv0tLAeeliuwL6rIgQaBRx4Mmv6llWW4P+pisAIv985B5xeiWC5p4TQ8+5J7faI3aeNaJ9Q+WEaOanDXhyEFkKzZLkJDeUra2REjWn3fBIM5KwX8fVBF6mBJUB79FIABWz8FlUTbz8epIGxKbcbklKAzMIjjLV0vRP1dRZb8NPllKuElaxf1F4BmxIYMdTP38hZIn32znLVbIFoVXGRt73CFhFFrqN3cT3THe3ulpaCCT3bIA8e4mPYT7s8zb5KcVVORoyvr/fxvb97am1MxVhb6Z4xc/eCPczq0a+ikTPV7F4soL8jyUN4168ELmkdWfHWIWDW/tqSRxEiAq6KSVsZHzMIMwAF6bont6EgAeL2dwLDHZBIphXQBkAeAE3AaSdxCth4ARZWrrhs8R83YZxx1fzTjti22Xliw1OvDGGJsT+IqWaHXkoK8Wlqvm88sayji8u+v1jsYvkOoHyeJi5Xl8KsR3Hqpw6ybgKNkiY9nrX0b4uM1gfs9uPmfouvJBxuZOtWqXppyAgUtpUDeC0/CsKWhJkl/h4eYcArHUKEz+8ZSubWh4HqBtWhw2dUCKurGBfvwE3jTIbpOiyLfeqLXUN1Tjj+V2ui8EEV40l8rR8ibg0+W6Khzst29Wqq8Ea8HMcdyJmPJIWMJXo2CPRgF5tIHZI2MIpQ+d1NqR+AYtjV9GCyrzZx0swuRq1Vlt85wwkmSmsLBeouZaqGp4fIl8C2CSlrJsUbRIP3+ovMsRI3HI6WzMfQ9qZG4ysxr4a3d/qp2BB8CJIwV65X6bKDSH5VnAete0ujYlsOacCXHBCIgmFstcBvsh5xUM2GDzm8FRMU3INxUlRe6GdIoNCC+OhJ7iZf4dMztDvYVoMtC8vG06wwRzfAMf40ATOk3ht/XiazY52heuYpRYh3a0QnpdG4Zjw+awQWdKBAJntSTqZY/6R+cRuHWLXkyiqTz4UIIp8SCZ2yxvEOxGmPwWmZ/HcQrQXzLQNAYA8HiSKAhtHEcHqIn9z27IU8rUWGVs8WzMHRxiUfPHn5vl2KEoCqGAsN8053SA9JHS1ZdORhWw08JsKQ0VfNRivvgKtKDCvlmlhkHx6O9DhvIuxzILFDv1xE0VBNv6k9xzN8Igwqw/w5ZdqPA97dj14A/eUo/rQcWOeSyBbLzIuL8xT2PisMy+LvS510V3DbbevLWgIOAqTxXSNaxOle1Fvdnh7EnaFZ5HcJxutpYTzymEpO8yVDXaAyJOz1Bi1Pk+8Trrk2Z4zsLsd/HQCWoYkKCslAUrTriEI7oZR4f2dypT0lnoTZfifmdozaUiKn3mqMeUTBiA0aD/qgJdulISEXYYAAEtixJrHXCriS6KYBqYRkxlPNxwI9FQ0A6btTwJ9YFZvgD4ZQ9YHf5UDSof7h3TH6zYGT1EPMCK6S6v/StVWRCfnYU8BoCiEpyEsfPcsDnS+rCDDIxYjD4E3oBQqyr6xSkkuOzELAkCwhfJGlVIQJMRXu6OWEcUB71F7qSEj1cr0ZefhfBBJ5wYa5WZBgpyqxTY79ChgrFmkfVUMkr6r+XS2bcP7VrODVwt+AAbLzGnkxTwsMxOOJsg2FZlinDjoLiAai+ZfB2Ah6c++z0rYufIyrZQGsdqfwxM9ZxTZnV3iDAVvOGLmsfxkhvmmF/QVrzjjeKHSOxnl3fF6zvx3xQZalu5qTCX0DVR0qZQjRBqhGCBJVrUYgjAS9y13XmmZV/W/Rv5+0DyLgv3bVWe8IeaJ1vaZY6/dGhaoiKI85OshGcPoDgsAhq2T3n25qDyf3eoK9YWK7eP/RdxOlsEm65uLdaWJKIAGcwCTgAIRByJtWXr2Pa2jHZZufKng9XXWvdlgoxCeW5K/4m1Fo+u/nkAlBb7oCDqFzbsBBVXDXa1m3KSBq2Q36YglvFIoR6mQsWhMoWQ0w3SQ14HhejtqUHma3wWFUhmZX9hcQo7duKJg4qD7oPpO5Z3zk81uaWS9DM/h5CBqrZS1cx3UBbf4HC3RPTdEBIWP2Im9pY60CGQAAD1bgM75Hde6a6CNO2t2TrFWOBWI/RQlM4Zw3tZZtbRiRAcQQN42YUZyHfA9oIb+fd3S1sK+7/LWWnrLNY67Gmnnj/9PGbj0KzGUVTjFTXEi5EG4wvvi0Kw0oeThV9GoVUxv1a3bPFhOdq+EHdt8QDHQ7bwJxN3hFrilfXQkT4ReRVbLJzAAP+ExSvbzT3q6Af69wzMDdVDcCSbB1yDIlazoDXBFwtdlNvidrerRpYFme+UCKmnCrVyZXdHmJ7q3RgWtoukBJcLmt4EqEd1d9gFclYLEoI/cQenxi24k/wx8cfbIjoiNc7foYg9XYeTglCLdJg0S8y0QRzsXgAzvYaQiy42NKo1q347VzIboIcQJQAYsld7LHaNosnOaQTX5ZgidGvQ1rTTTQjEqmwK5vFMVHM6nVa39HgYEfAhzugD3dpNGb53eZKl3M+1eNo2XFasyUQ3oYOC6S7TWQNuMrtxWrqA7rkYVoP6pX+zJFID45VAtkt+HN4kVMpAAbX+vYCmH088CgR38CHN94ed/jlZTRMFy19/QHrpOWiP9HVWSI6HE2FowjuMM32ujBqD4hfo2OV1CW0i+95m5ma3JFtZ6RwgAdTBdSuZFI/Pfu9hmyzj07SuOGJEEfbsxL9iFXh8rCQt+UXLte2q22NkBvaZe0xIAGi/89ohCLkZoC4xhlqqn62o7OuuUvUyzq0xP9QgQccpDTOKQn7kpuxmD1KChipsHeXXiUIrKGpwQARYvUdu9NyTmbMFE/g51ZX85J9TgiKv2exrp6uncvUHU+aEoC6kkPlaCwmxVKkC+e8gsTuQVDvgKAAAAO+A3/XOcIrmH1RMUtzvikh1rAwCyCQPYWgGgRKOndpiOPJmYHiEZq3LoNDdWZoFbqrK9SsUox1ZVQlLliD0KBpR8ZgJnte1N06Jame51TcBgeaMUVwpZThIuj3qtQ1ad0mHXE4Msw1NmYSHjpCVOGx5I4HLdPoIeCn0ZAF5c2eYz+sRn4bhqMsJu/ncUfcuxH4HxYiWX8kwAReRqgekeYK0IAYjyCR9VKn5yMjvl5kn96dOW7t0mJ4QzwCp6QPCECFcJHirdbFWwBu4PMDK6BsCtHsoz4y3JUjgYecq4fectZj+48yW32/wvlj3DDgHd8Vn1ZUQcyY3aLBY2E2+MQHw29I7bM9ZFl7wHjbDkmFhR+tR08MPo/GjlFVTYjBcyIV0llnK/8LciOPeAruuy60LdpSq0id4RC53Vem9nobfcS5qV58HcA1bJISZPX/8dBvnueWTaUQHVITSyPIDZjhsWgPdFJwUYFHUUgAAFmFkbOxJdcGuyE6CWJ8JK/Sy64szxuLxjZPVCUvZdufzjse1m8PhqhDNJV/4XIBupJ3DZU7Qc7V4BSMdhzBj9i0DH3N0Tdf+W2yRBs9M8wxOZr5znZpbM7u07eu22IgjKSGTxGNn3dV6D+vJSTapqu6n6YSjoZUu8P3Hw+I6G971A8Mhef6T3VVTC+YttPDqQlWfuwW/TmHGLYNoA6Ygpw+WM+jn2PljmMqr1cc488Y9L0Vkwi2ql4NdDzg9fRrbK6ABAmRagwCbDC1BcIfiWTwoi0WK3WjZoQhgq9ADmirVTIvk9IXJf7z81sAUKmwpUa5JTlIPLf+EdAfFLfVwWPOxIiLjkswo9d1Am1olWenorS0mfnZucCkWMs+HJNqFf9qNjNxGJxDdvtBaU44BzVSVY8AKg46vfVw1lPzQdCJEzs1tBt/uxy/+eRO7yhW+7J6BgQm1k8Y9DG1wXTIj8QiNwmlOwZj62Ni73LO1qgJW48wHdBJgMHBotFQJ+12detgykJ1v2qQgLTBLv1kX6ByANvHOnzGaCCXpDFu1icuthnQKVyW9K1FKhqswBf40l+Ztkvln75zCG0t0Ylp9l40SQoLQsnyMKVmrprQtZI7nkpIsIJXePrICMABbjJz7IAIf75SlgAXwLOL1O6l+9gN9YNCJ4RIwjtiYqRChanigGAzHQj5HyWN/UOZnMT1Vwmrff3NRSWvKHg+8WEiajC2dr47t5Lpl79EN1A5CprRdeQ/h28w0zFk8VPcx/sTKqfYABKV4vAZeUvY55o+Tw4QYAAEVWJyKpIMhVolD0apEExQnD6wgUK44iQ6fWo2WRDNV/d88PcHaM+oKyZ4YtgMYmAa7F6o+NQnOZsYnWbaOqhQBIVXv5Em8O6GpHs0aVjLYHih1V9h0twTaYBOVqjcJKA0XAALVAAQHPQYbrOCyq1AeRP1JN3IpZ7I+k9i4eDM+lEgsnICInnslVaaJhjGix/J/v9PDVjpd7v47jFpHpHHfmJ9bc8RKhapm5tMLdDQgb2xLYZHmJClfj7sJQBOY3MCxIxXANFO4ZgtGhQmRxgSZ0o/Zm5di1+pKuReQ8PtBWGThVtP8LXbJyN3WQFEcp+8yfa9CXOexyFK3QcCGERAk70u1bMdjq39Dz50X4r5fjjyAW1OF8B/jOIgUo4c/RA+EG/rEWGAAABxPaDXUvBdiRCVKASBqp2vxMrxhgDudsJbL1oUUKoEAR301RO7yRQzu804r0zT3NviEmeFP3jS0Bl6ML+UeNCmKGM23ctF1lYUlQJRGgYqtYv4Y1BppUeZdVy4XuQjjrKAdFxGx3o6jSS6DN1I4iC6EA3UNC7y4lyOJFEY+M+X+8bljUtIPUwqRCi3CQpjKwuGUzZE0OKmOufTEKBiJWFYBXPuKYqbh7IZvObqlYKM5Dg1usJ7VjF6FmS4oefkwZvWU8qryjq45AAB5dJedE6iaIgFQIAHYLKqI4KpEWTJy9MC8d69CviGf0pPxCUJ9+EpehxsHC/Px+BUQTXe4lFIe+pYWfdyCjHXayjAqiI/D6SJ7XGsCWn/u9HbO/G3n5/3VtW+Vm1sbPQwEA9DMwN84+TLg4r12ErHgAAE9mTwWt0I6vLdUjN8tJ4W3b6DcO2Msit9UBXW68+vCLFjfR4ipTTtdoR/AMsFKBWfrIWCWO7Ei8oi+Kdb6d3wFRKkfz2K9rtWywz9wwlWwW8A1iGnoAPzIQPayswmTBUg3AqdqDysERjCGhk3k2uZDSgOE9M1aSozF3CxyaPsBA0iwdOJ3xkI/sYcjSHAf4nVZJq9F5nXC4UfuIDGIepyqKCpaKaEnkpgMALqlmxVm1jeaSEeTJbFOU5JhixamTDtPMJzbr4GjMiQQb9ZScab1PPfTc9w/4CmkAbCkRmBwPjOfy3g1C2UyaYY6rM4DhOeeZWmX/QfwuP3m+RPqNvu48q01yZjmMax4+GIwOqNvbteZN6yZfkaWPxVqwJupw9gtCwb18nO5HXSSSpET1Ono2ehlbJbYMO3KuXQs9ajVw33QU8OXeksj49Y0n2z880xakMSIQIz6zpJYZsVweYeLOREpcHuHifiVNvWfHtErT81ln9vmdzXgQKqDy9sT/3lAZz61mp+wHX+rcMxKDT3d3O2EguFpuETiqvPWOhxjlEM6Bcej+wXHkcKDCzwZwUM9M2Yo+yw775qvSyMvilrs1/462lCBdqPwbvZmzHomW7lFEaUmRG1XIptqcKpZvw452h4AF+azc8z3W23pM2BYvnudPKPzoXJJPg8x2TaRZXPrE8KeBUeFZkRmwdDusEh8efvao4i7OYTqcwZc2lD6vYjDdhSWJkKILY4fKvUk13AMAQ+9kjl0JLGN8u1x99JA2QGcrbFGJYwIYzSCpdszODaYkBpzL9izt/EzdJNmm5fHXXjdmTTuS9r+/i0hj1MRFbvPrIFK14sGr9kthIg5LBmRSyQW0lxfJ9zJJo+FHUko/OWt6h2Fh4Sa9EPlYrosOmaSWFNeDjLukaHwD7X2RGisqVM+js2MfrJMnNKb82TOlc4VrsHwhIuB+9dYKwZxsn0dJxGNVZkhri/dGxBIcPklxWhgtXVJis3HAPTVAvyfsSFOb1ES6kHVo/5q6HOpFB9y3Fzn4AzdYdDsy3R7iHrIce/xerAwRkpL5m8PNkh4kAjdC9tzcX/69hI2V/J7w7qGXam8xTtK8MRLpsISTWSS8pLLHXI6DA6OSs5NXfVGGD/NaaQ7BAtSEUruoXrUwSXWIbymP7w/yS8d044W0yNgVQhi9fTZiSRXSfQA9vyaPGLwnPKblbeFza0CPyy0ZyQzGOWD2DwQUQjtwm61Kn4I8gvbXJI3aY6BQFQFjEaipQTqw4cM+HYhr2SS1VjkyiiymHd9a10U1jViwKMqfPK9F+a4W4TznKzni6eiUC5Z6MJqQ8Xp2TZS21wLOqoHPZxXEEsqLqOs2kvMEVsI2jhBRH/SYe59EH5g57xybA6WVk6RgSG0prEzgO29+Da9RsXjjiFkJqu8OJGPzdjfbZcntzuiJrUUOCxsJeWeVUZAELaxMjc+wnKStNYtK2agPbsT7g0mfxuuTUvtFkVxWvCBWpvimHnnkfSXFCJPvUAQM7+s671I8F74DLv+HiJYVNKQBiAJR53UDEC7o0LZR49CvYxFs67KCRuI2UNVMaprSJwkEK3XzovxXHVc0j3My8yhty/EwGv0g+2sN5JDlTJjXyCTo/P8GWi5IrPKAD9coXF/G8P7dl40NQdzzxwO8GjQiw+LeHyhZtK9N0iI5Gjboe82ctyN7Nilg4wpuZdfAuo2/VWXjDOH9l0L11+ECDlFRGOtpaEA10ocmnQLYMhsalg1NLiMR2y7oK7+J8VUaYqn8r6IU6FOOmeczPe9GVBk/sRKKfJMFDWuHxpzgtxGxbx1rUBngJbOvE+FSohhgkWynd4wItcBfPUvk/4TS4h4e9BHRLsMT8w0z9WGWyLXNWYjvLJ/u4lzlVJgkbZzHE5Gd9kBg9Uba6XJm7zrKjR6v0wsD6t7kKpIV/gG88JuAsIjedCtoaMAyVRurlPX578ePPX55IaTwF/i99X6v0+hXtSOZbyI3IhZX6Sp1zd1bJP6DXNYE86YT6877Lu/eeoWrOQP8F1EmvBBvtl5Cwwo9ShBPmoJ/D44kgxoH5q1a+8nFvPcETwv7xBXfHHwtFm/6N2lCKQ0Nzo5+/0th5hIX91xosh3bT7OUGeTj2jUcJnIfxa5gkJhjiwoVdPXnQgB021TBDukCh/rQgftM563iWsKphVMTgOlc9Sun6Ufkh92ng89OpZRDrhqWKAp2O2imhB4YMUp7Eig1iDoVu8PMUqaiLhUKdPEMrLii7Tlg7GKRaa+xMiZGO7U7lDqHwDzGNescJtkp9SYdZttkA9S59m8kvT83sWJ7kjXuHQ9AJ36KygAFwldiN+y00IYIvcfAK2imSKvDbZlG83UC8ffq0x11c9jtFMLN+CvMJ8vxHBddryKN0GV1OxZ2JWFVfZNYe2XkVSKTnmjcR0+R5kaoS+h3R13BdPw+zkhHvte0kkUbbDTe6L0hh06z6K5DqMDnUsFhWqmCzOJH6u2lhWORA8VTPoMy28FRZyXIatQxb7RtEoDLCUkhHM7cLC6KG9SbpPHs9Cqr/zmY/8t2fPfAnBWQlL4CjB8JYNqeo2gylicnMmICzzPq08SphLpgAnfhaZfsEtwtOmVwrqVFaOI+db/gjtERRcFIGwFckzNFxIyCUjI0XjWTirTmVsgSFsf6EY9m3dnlj2oFGbWu2XKtt7hn8IZSMIYTtSmerlABf9UUFz1uG4dco1ksqfQLp6gImSto4jWUEfl/rjnfwYyxUdjW5rrfaC+UqAOnL7uIFlaXYAJ/05AySZmUVQKqZS5LrBV75S+uHS6c3mpB3N3QeTlYOR1Xv022IdkEHmlQd7OA9OmCJ0a8q1CFNTirG/4fzAQR+03lJ4wpaBlcE0QItGrQd36DGhkrNcu7MW9Jz3KAThJoLsORSHyI/AoCCR/0URvAVzce2Rc2yPt7Bup2jqFDO/+Ats00HQpH4EKZmkTSsq0nKTyNl5B0ywsbGPnezAofA+5uh1gapQMukX796Fcwqw9+RxRRFBk9KOtJCkBHc2FpJfGb2OvGEHXB/bAHLDIe/qCD4MqTtlzoxe8IREpRsJVczLDHicJN9JlH7rkkog8Z0Qi5uok6fXNLt3il74LSjID2SIIWtWj3usjtykX33q3Fb7KFlUFTe13p3MgoTbOW7FFX0qBQKLUkfULYlcq4AdmHEJ/08eQyHzOcQbj3a0x4Gfu1XRHeDVjdbsTQXf56d3hjgM6YZZxXMKAjTRSMfOkPdnOQhDfoKeTEAci+z6x6z8w8SVzIH6NW3/kUae10/a7YO7mYJJ+0tH6kTD8tzI3u4Yi7Xq1blrAT7Mh35ORMkcAYWGPxwV4xGmjSTCldL9wRDL+Ul2gjjJOgTL0Aljvi79XAGSPEHlU2yVn7r5UOM6YEvuQs7uuYZdNFnab6Q2uuZJ0BX51g5/iruhIRrKjKIuyxqJt1EjbqI47No+Z5eNsttsxg1x4rxrAxgtHwk8sfJBy+uHUfdFz9NgXAEcOZErK3mPOxifcBiWHv0eyp2jbiMcQV0GD5WxIXl/66eGqwYN2z7vNe0ZJ7uapc4fZQjKAF+zv95EpyqRT+HWFXFN0YbesXTmNwhFiNl54aqlcriB3GmoMkOEGQj+U083nd39Ct0CQniCyZ6aO+dtYaRCRS32gpBTjutK9WZb1zcpKZ54c75bCAyaj/zPLYZofTwS0PKrYoF6sRtHqaRhYqW1BFWY6ybXfhw6y0fOi0KQS0vzwwN/Be3HdZZ9XlyNU89p6b1iwGr1bXa+ebU7hv0kpB3jn0Yu9aHEkDYP9QpHA2PQqCJ/Cv3cdvKY5VFR9OCwqc1cdzswiV5vwX3utI0YrJjux+8BxT3JCcg6ADeBf41D8rCUshDklbd3SV+paa2vpW32L5ttTLI+b+E0rioLQohAHTylVgo7Bjd7XuVPgm/tCmwbd24sezGzwDe3QOs/9KDBiKuEORAbtewxqyeiDKz3Of0AEjapCg0m6edS6oIBeLYafJebcpLVF/wYEm0jxCGq6JcGAoqwGuxdAp6YbkmN8m0fs1PPVNSHTmR37QGh+LMqc/jW7GQZkeAuQatWxqHd109sB0mCIPk2esmcMhXSN46sHrsBUMwO9eeEIhGqMM4sSAe2p4r9/rgeW9GJuRr9tmLEcJkHAlwyAM41ZoioyWZaVntTgtNu4XbXjT2NGG9Zqz+w+RbZMYtutKl8ArK7LsgPHvqY0guEMnsJqdO0ExuABiEh4vW0ADfYIYJYkPylEAyH0eIAu+Gho+ZUCnyTZItDqvk8Z3CNZMV8yJApLJdf7Xly58zcYbExptmnFZ1LeuXd0Bg5tebTSAzV4kelAm3SsKN3j0MbaoNUulN6acWPKOFiFSBhQP0tB1WRnQM+3fuUcwvsvvcoJIktfy8NJ9pZP0bF8RaFZxdCeUnUwgKoBokkZ1wb+3YAsN1+YUGoEiL4jo7ZBENVBQZ9m7qVukqd7w87XYSOYO4oWsAQPH3KEXKZv5GvZOP9nVPcwJTtCySDrZ6r9Cp5pChA4eCON/r9bg74NhBeReArPgxyC275tmbj6ag/wSTzf3gHRuHcquWLIeCPyj18j+JvFU2InvfXt68s35zQpPxnrxPlEi/28S4vE+Z/fNSbVMm+2TDYTo7cEfV+5e9EC0J1b1NcNvT0q6AVdLxCocgF4FBLrijhaZzTRSq93zXXEpCs9Hic82vqDco4hpb1cmCOd6MTjpJ0yDPJKxbjOM25HZThbXyrb2x6MKw2Td4lNGJCxRQH60w82Peeg2futssrKXA+/gZzfll84llsb7rXp9kjTseaVp3oRb3vGubal6dGcIjt54dRODm2SeaerJDLcegCQjRbZrAnrbSto8DAtwxB4yDxBDP08LAEw1xAwe85r6/W5nt5K7+bqtPWpbMjieswOienFTPFWLPNU3oKzciXqeerGz/Rq8NgP7avcE5N1xVbE1R5rgvpBNbcONIVzlqds+8PIry8i9+J9TG85pRe+7r1+OsI3iFN66M+50WuCp20iD/CLOZYIm0/IsFO8VO4z5IlZyGdzGL33IAQ8b/3rc40maMj1JtWmeIBYN3l3iDjZLnDY115Y7LtDGP9JIwy3c1PPK8LEzwoUNg6xCx3skxQ31KE1WklNv07ciPXNwQJV7cMwOzKwuDKzULiLHbfo1lP2ROJiM2cRyFtTGiSwEEPDWNqOQh9UEX4IBf5q0v6ptdukAit6GEY4TD/xZrsp7hykjkEYFm3V56rsTTB7Q2HeNXf9Tgd+L8yhBw06dVa+YXdafRyZ+s22gX4XBoaUMdz8MNBfiKDEggDBO/d1IxNY0rnaafM56I7veZODbwJECTzxV5AyAywFNGta+c9C3+VKH4G1Ew9Y8fxHLvRUCJqTNEAFQl2XAolgUA3VonOargZj3VweKn+kYFOw+JdxvNdfBAt68wq2D3fv5n+ZW+kaQrl2BXLLS3BON1kIJo4FipjcxhPT2rperNal63FMjkZRI7ORk/I7Xcaa4fiZ3o/nLtCTIgC6hg/WNlABq/B9INfTDybBw/YNKdZfqY8608A1Zdf/Kfx90eaEkZ/IJ/JbYNmw3TGrlAGzDdFBy/X87KJJZOcs9vsdWcQovRsPCV+LdafckYnUQUOh7PQpSegZb6HEhJIVjrM3mPK6ryYbK6e5FeT504wGm+HFvnVHRQkUAlgWTFHWzIbfGaZ2eOsmgucj/uEuJKkQJZfdsqEIsJPdqlpLq99ief9Kagn+/54MfmYpM3F9CSbml5wSSQZw2xCrnQG7395q52ia7BqX7TWZOTpLttkFP/RydhnijAgQCnLKK9t3P5xAEOvaTBHW7eGV8WA1g1rMAdXvVysJkyn1zFF/277aDirWUwxODsgSbaZiOPmyzkWf/SGXls6nbVxL1/fpUeLtSzFvoFgVJcXqI8zawLLKUyJpy0ruvjGC9Kio7TBg+ETOiw/MDzP/pqG36S3EBC1BFo7cOeYeRtEveX5UFWELf0jpJ1pwE4dw6Wn2cVcDj6m2cZNayXm0Eb2jASzv6tt33S4WagxHBQjBU0at9Nfzl+A3RHttN0bDzQVf7Ym2Tjny7mginjRpROoe/ng5REZIVNWzUfsrdeFI0KcMkIlBlVKcDIXQjkICT3cJY08Es9SpyvJE0o0zuGLqZRScmBYhiH1GH2AZJIAM3/5KKaAuOJVrAlXooLz+H4XOjKjrVhLEfQb88vKGVtROaWdbgHeji+nG5YG7tP7TQwbdBFFyqVvD6PiajyWJP9mtzk9Drr3JpStXRQX1UpjiDukfe7m6SSvQNYWg7aqDQrpccMyVB2Z6FXvEwViMJAJYZlwlV3n4bQ3xWkBfOs7xdlmbuWHANwUme2hy3w3/K/QIHSwIiRBOiUhw9SosHuKAL9B++enovHnYsjnRB7t77hCAQMc3+JCqy4rSatQ4L/scr8sNfhDtyMJzfNIjtRFzqOWeBIMMJr0GRRTgVorzAAAA=',
  role: 'Creative Director and Branding',
  config: {
    whatsappEnabled: true,
    phoneCallEnabled: true,
    emailEnabled: true,
    avatarMask: 'hexagon',
    smsEnabled: true,
    redirectEnabled: false,
    feedbackEnabled: false,
  },
  type: 'agent',
  owner: {
    $oid: '65ca137c4f774a6d762049ea',
  },
  address: null,
  reviewRedirect: null,
  colors: {
    background: ['#8B5CF6', '#10B981'],
    elements: '#FFFFFF',
    useCompanyColors: false,
  },
  customFields: [
    {
      iconName: 'instagram',
      value: 'luca',
      _id: {
        $oid: '6667702a3d23e2840f0f4f8b',
      },
    },
    {
      iconName: 'twitter',
      value: 'luca',
      _id: {
        $oid: '6667702a3d23e2840f0f4f8c',
      },
    },
    {
      iconName: 'linkedin',
      value: 'luca',
      _id: {
        $oid: '6667702a3d23e2840f0f4f8d',
      },
    },
    {
      iconName: 'freelancer',
      value: 'dfsf',
      _id: {
        $oid: '6667702a3d23e2840f0f4f8e',
      },
    },
    {
      iconName: 'googlecalendar',
      value: 'intagram',
      _id: {
        $oid: '6667702a3d23e2840f0f4f8f',
      },
    },
  ],
  createdAt: {
    $date: '2024-02-12T12:47:56.655Z',
  },
  updatedAt: {
    $date: '2024-08-02T20:48:13.206Z',
  },
  advancedProfile: {
    enabled: true,
    items: [
      {
        type: 'feedback',
        visible: false,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 16,
          textColor: '#ffffff',
        },
        caption: 'Valutaci su Google!',
        icon: 'google',
        url: '',
        style: 'filled',
        _id: '666773f08af5f85fdfac56a1',
      },
      {
        type: 'avatar',
        visible: true,
        title: '',
        showTitle: true,
        _id: '666770383d23e2840f0f4fa6',
        textConfig: {
          enabled: false,
          font: 'rocaTwoBold',
          fontSize: 22.5,
          textColor: '',
        },
        direction: 'horizontal',
        label: 'Luca Venturi',
        sublabel: '',
        useRoleSubLabel: false,
        description: 'Random stuff to pad',
        imgSrc:
          'https://s3-api.vps.notifyapp.it/notify-api/profiles/65ca137c4f774a6d762049eb/666770383d23e2840f0f4fa6/download.jpg?c=1722630254113',
        imgMask: 'circle',
        ownerImgCorner: 'none',
        align: 'center',
        imgSize: 82,
        imgFit: 'cover',
      },
      {
        type: 'links',
        visible: true,
        title: 'i miei social',
        showTitle: false,
        _id: '666770383d23e2840f0f4fa9',
        textConfig: {
          enabled: true,
          font: 'poppins',
          fontSize: 30.375,
          textColor: '#ffffff',
        },
        direction: 'horizontal',
        style: 'text',
        items: [
          {
            icon: 'github',
            url: '',
            caption: 'github',
            visible: true,
          },
          {
            icon: 'gmail',
            url: '',
            caption: 'email',
            visible: true,
          },
          {
            icon: 'instagram',
            caption: 'Instagram',
            url: 'luca',
            visible: true,
          },
        ],
        openInNotify: false,
      },
      {
        type: 'label',
        visible: true,
        title: 'Founder of...',
        showTitle: true,
        textConfig: {
          enabled: true,
          font: 'avenir',
          fontSize: 15,
          textColor: '#ffffff',
        },
        content:
          '<p style="text-align:justify">SquareHead, azienda con sede a Milano, fondata da un gruppo di giovani imprenditori italiani appassionati di design e innovazione tecnologica.</p>',
        style: 'text',
        _id: '66ad4394c5e84e46c0dc2a50',
      },
      {
        type: 'contacts',
        visible: false,
        title: '',
        showTitle: true,
        _id: '666770383d23e2840f0f4fa8',
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: '18',
          textColor: '',
        },
        direction: 'horizontal',
        style: 'outlined',
        items: [
          {
            icon: 'phone',
            caption: 'Telefono',
            url: '3913225127',
            visible: true,
          },
          {
            icon: 'mail',
            caption: 'Email',
            url: 'luca.venturi@squarehead.it',
            visible: true,
          },
          {
            icon: 'whatsapp',
            caption: 'WhatsApp',
            url: '3913225127',
            visible: true,
          },
          {
            icon: 'chat',
            caption: 'SMS',
            url: '3913225127',
            visible: true,
          },
        ],
      },
      {
        type: 'note',
        visible: false,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 16,
          textColor: '#ffffff',
        },
        note: '',
        showNoteTitle: true,
        _id: '6667733c8af5f85fdfac56a0',
      },
      {
        type: 'avatar',
        visible: false,
        title: 'Founder of...',
        showTitle: true,
        textConfig: {
          enabled: false,
          font: 'poppins',
          fontSize: 16,
          textColor: '#ffffff',
        },
        direction: 'vertical',
        label: 'SQUARE HEAD',
        sublabel: '',
        description: '',
        imgSrc:
          'https://s3-api.vps.notifyapp.it/notify-api/profiles/65ca137c4f774a6d762049eb/66ad40e66fdbd12109de2b67/Squarehead logo.png?c=1722630734876',
        useRoleSubLabel: false,
        imgMask: 'banner',
        align: 'center',
        imgSize: 100,
        ownerImgCorner: 'bottom-right',
        imgFit: 'cover',
        _id: '66ad40e66fdbd12109de2b67',
      },
      {
        type: 'label',
        visible: true,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: true,
          font: 'avenir',
          fontSize: 15,
          textColor: '#ffffff',
        },
        content:
          '<p style="text-align:justify">La società è nata con l\'obiettivo di creare prodotti di alta qualità che sposano l\'estetica sofisticata del design italiano con le più recenti tecnologie.</p><p style="text-align:justify"></p>',
        style: 'text',
        _id: '66ad43dfc5e84e46c0dc2a51',
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
        style: 'solid',
        height: 1,
        color: '#52565D',
        _id: '66ad45e6f6daca47846a7ff8',
      },
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
          'https://s3-api.vps.notifyapp.it/notify-api/profiles/65ca137c4f774a6d762049eb/66ad44bdf6daca47846a7ff5/Squarehead logo.png?c=1722631454006',
        showCompanyOnClick: false,
        dimension: 52,
        align: 'center',
        _id: '66ad44bdf6daca47846a7ff5',
      },
      {
        type: 'label',
        visible: true,
        title: '',
        showTitle: true,
        textConfig: {
          enabled: true,
          font: 'avenir',
          fontSize: 12.5,
          textColor: '#ffffff',
        },
        content:
          '<p style="text-align:justify">Il marchio "SquareHead" è nato dal desiderio di rappresentare la combinazione di linee pulite e forme geometriche che caratterizzano il design moderno, insieme a un approccio intelligente e razionale alla tecnologia.</p><p style="text-align:justify"></p>',
        style: 'text',
        _id: '66ad45b4f6daca47846a7ff7',
      },
    ],
    pageSettings: {
      backgroundType: 'image',
      imgSrc:
        'https://s3-api.vps.notifyapp.it/notify-api/profiles/65ca137c4f774a6d762049eb/background/Abstract_waves_wallpaper_iPhone_yudhajit_ghosh_idownloadblog_Wv_4_684x1536_webp.webp?c=1722630192247',
      fill: '#fd0839',
      gradient: {
        direction: 'vertical',
        colors: [
          {
            value: '#8B5CF6',
          },
          {
            value: '#10B981',
          },
        ],
      },
      textColor: '#ffffff',
      align: 'flex-start',
      padding: 1.5,
      verticalSpacing: 0.8,
      font: 'figtree',
      fontSize: 20,
      redirectUrl: '',
      topPadding: 0.95,
      hideContactSave: false,
      useCompanyTheme: false,
      backgroundBlur: 12,
      backgroundBrightness: 70,
      contactOverrides: {
        name: '',
      },
    },
    requiredItems: {
      feedback: '',
      avatar: '666770383d23e2840f0f4fa6',
    },
    _id: {
      $oid: '666770383d23e2840f0f4faa',
    },
  },
  noteOptions: {
    showTitle: true,
  },
};
