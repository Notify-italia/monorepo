import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CapacitorService,
  ChangelogFactory,
  INotifyVersionInfo,
  NavComponent,
  NavItem,
} from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [CommonModule, NavComponent, RouterModule],
  providers: [CapacitorService, ChangelogFactory],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public currentVersionLabel = 'v0.9.0';
  public currentVersionDate = '2024-03-22';

  public latestChangelog: INotifyVersionInfo = {
    tag: 'v0.9.0',
    date: '2024-03-22',
    title: '📝 Closed Beta',
    description:
      "Notify entra in Closed Beta! Se stai leggendo questo messaggio puoi richiedere un invito per scaricare l'app nativa inviandoci un'email a supporto@notifyapp.it",
    artPath:
      'https://s3-api.vps.notifyapp.it/assets/version-art/v0.9.0-agent.webp',
    changes: [
      {
        type: 'improvement',
        message:
          '<b>Changelogs</b>: Modificato il layout del changelog per renderlo più leggibile',
      },
      {
        type: 'improvement',
        message:
          '<b>Menu di Navigazione</b>: Aggiunta una gesture, da mobile, per aprire il menu',
      },
      {
        type: 'improvement',
        message:
          'Aumentato lo spazio utile per la visualizzazione delle varie pagine',
      },
      {
        type: 'fix',
        message:
          '<b>Profilo</b>: Corretto un problema che impediva la corretta visualizzazione della Bio',
      },
      {
        type: 'improvement',
        message:
          '<b>Pannello Profilo</b>: Modificato il comportamento dei pulsanti di gestione delle integrazioni',
      },
      {
        type: 'new',
        message:
          'è ora possibile scrivere il proprio, quello aziendale o il profilo di un collega su un supporto NFC in completa autonomia, tramite Notify per iOS e Android',
      },
      {
        type: 'fix',
        message:
          '<b>Pannello Profilo</b>: Corretto un problema che causava il passaggio indesiderato tra la moodalità contatto e la modalità URL',
      },
      {
        type: 'fix',
        message:
          '<b>Colleghi</b>: Corretto un problema che impediva la corretta visualizzazione di alcune opzioni di condivisione del profilo',
      },
      {
        type: 'fix',
        message:
          'Corretto un problema che impediva la selezione degli elementi nei dropdown avanzati su Safari',
      },
      {
        type: 'fix',
        message:
          '<b>Pannello Profilo</b>: Corretto un problema che causava la ripetuta ricarica della pagina di preview di un URL',
      },
    ],
  };

  public nav: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/pages/dashboard',
      icon: [
        'M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z',
      ],
    },
    {
      label: 'Profilo',
      path: '/pages/profile',
      icon: [
        'M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z',
      ],
    },
    {
      label: 'Invia File',
      path: '/pages/share',
      icon: [
        'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
      ],
    },
    {
      label: 'Note',
      path: '/pages/notes',
      icon: [
        'M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z',
        'M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z',
      ],
    },
    {
      label: 'Colleghi',
      path: '/pages/colleagues',
      icon: [
        'M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z',
      ],
    },
    // {
    //   disabled: true,
    //   label: 'Calendario Appuntamenti',
    //   path: '/pages/calendar',
    //   icon: [
    //     'M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z',
    //     'M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z',
    //   ],
    // },
  ];

  public bottomNav: NavItem[] = [
    {
      label: 'Log out',
      path: '/pages/signout',
      style: 'text-red-500 font-bold',
      icon: [
        'M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z',
      ],
    },
  ];

  constructor(
    public capacitor: CapacitorService,
    private _changelogFactory: ChangelogFactory
  ) {}

  public handleVersionClick() {
    //? perchè changlogFactory è un qui e non in version-label? perchè triggerandolo da version labl non applica correttamente il backdrop-blur, oltre che ad avere diversi problemi di alignment
    this._changelogFactory.create(this.latestChangelog);
  }
}
