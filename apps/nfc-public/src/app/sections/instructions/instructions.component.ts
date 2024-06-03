import { CommonModule } from '@angular/common';
import { AfterContentInit, Component } from '@angular/core';
import {
  EnumNotifyUserType,
  INotifyProfile,
  NotifyPopulatedNote,
} from '@notify/interfaces';
import {
  ProfileService,
  ProfileViewComponent,
  SSRBaseComponent,
  SSRDirective,
} from '@notify/ngx-shared';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'notify-instructions',
  standalone: true,
  imports: [CommonModule, SSRDirective, ProfileViewComponent],
  providers: [ProfileService],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
})
export class InstructionsComponent
  extends SSRBaseComponent
  implements AfterContentInit
{
  public isProfileReady = false;

  public demoProfile$!: Observable<INotifyProfile>;

  public steps = [
    {
      title: 'Richiedi',
      description:
        'Contattaci tramite il form di contatto per scegliere il piano perfetto per la tua azienda e informarci sul design delle tue tessere, il nostro team è pronto a supportarti in ogni fase',
    },
    {
      title: 'Iscriviti',
      description:
        'Vai su aziende.notifyapp.it, crea un account master e immetti la tua licenza dopo aver eseguito il login',
    },
    {
      title: 'Esplora ',
      description:
        'Crea il tuo profilo aziendale e gli accounts per i tuoi dipendenti, distribuisci le tessere ai tuoi collaboratori e inizia subito la tua avventura spaziale!',
    },
  ];

  ngAfterContentInit(): void {
    this.demoProfile$ = of(_DEMO_PROFILE);
  }
}

const _DEMO_PROFILE: INotifyProfile<EnumNotifyUserType.Company> = {
  _id: '655805c8f5638dc5ef4b3590',
  name: 'Notify Italia',
  surname: null,
  email: 'notifyitalia@gmail.com',
  piva: '02585410976',
  phoneNumber: '3240552651',
  bio: 'Regala un effetto wow ai tuoi clienti. Notify è il software che ti mette in contatto con i tuoi clienti in un modo mai visto prima!',
  avatar: `https://s3-api.vps.notifyapp.it/notify-api-dev/profiles/655805c8f5638dc5ef4b3590/avatar.webp?cz=1716325796196?cz=1717417251607`,
  config: {
    whatsappEnabled: true,
    phoneCallEnabled: true,
    emailEnabled: false,
    avatarMask: 'hexagon',
    smsEnabled: false,
    redirectEnabled: false,
    feedbackEnabled: true,
  },
  type: EnumNotifyUserType.Company,
  owner: '655805c8f5638dc5ef4b358f',
  customFields: [
    {
      iconName: 'instagram',
      value: 'notify_it',
    },
    {
      iconName: 'globe',
      value: 'notifyapp.it',
    },
  ],
  createdAt: new Date('2023-11-18T00:31:04.645Z'),
  updatedAt: new Date('2024-02-27T18:13:21.069Z'),
  address: {
    street: 'Via lorenzo ciulli',
    city: 'Prato',
    number: '40',
  },
  role: null,
  reviewRedirect: 'https://g.page/r/CR140V5wBLmJEBM/review',
  colors: {
    background: ['#0A2859', '#041127'],
    elements: '#F9F9F9',
    useCompanyColors: null,
  },
  redirectUrl: 'notifyapp.it',
  profileIdentifier: 'notify',
  note: null as unknown as NotifyPopulatedNote,
};
