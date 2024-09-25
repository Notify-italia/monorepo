import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  ProfileViewComponent,
  SplineViewerComponent,
  SSRBaseComponent,
  SSRDirective,
} from '@notify/ngx-shared';

@Component({
  selector: 'notify-instructions',
  standalone: true,
  imports: [
    CommonModule,
    SSRDirective,
    ProfileViewComponent,
    SplineViewerComponent,
  ],

  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
})
export class InstructionsComponent extends SSRBaseComponent implements OnInit {
  @Output() public stepClicked = new EventEmitter<string>();
  public steps = [
    {
      title: 'Scopri Notify.',
      // description: `<p>Apri <a class="link" target="_blank" href="https://aziende.notifyapp.it/signup">aziende.notifyapp.it</a> su un qualsiasi browser per creare un account aziendale senza alcun impegno. Potrai dare un'occhiata a tutte le funzioni di Notify, gratuitamente, per 30 giorni.</p>`,
      description: `<p>Crea un profilo personalizzato quà sotto o visita <a class="link" target="_blank" href="https://aziende.notifyapp.it/signup">aziende.notifyapp.it</a> per creare un account aziendale senza alcun impegno e dare un'occhiata a tutte le funzioni di Notify, gratuitamente, per 7 giorni.</p>`,
      anchor: 'profile-builder',
    },
    {
      title: 'Scegli le cards.',
      description: `<p>Se siamo riusciti a convincerti, visita il nostro <a class="link"  href="#shop">shop</a>, scegli le cards e procedi con l'acquisto.</p>`,
      anchor: 'shop',
    },
    {
      title: 'Attiva la tua licenza.',
      description:
        '<p>Inserisci la licenza ricevuta via e-mail, Spartisci le cards acquistate e goditi Notify al massimo delle sue potenzialità!</p>',
      anchor: 'license-activation',
    },
  ];
}
