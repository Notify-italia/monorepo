import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  public steps = [
    {
      title: 'Prova.',
      description: `<p>Apri <a class="link" target="_blank" href="https://aziende.notifyapp.it/signup">aziende.notifyapp.it</a> su un qualsiasi browser e crea un account aziendale senza alcun impegno. Potrai dare un'occhiata a tutte le funzioni di Notify, gratuitamente, per un mese.</p>`,
    },
    {
      title: 'Acquista.',
      description: `<p>Se ritieni che Notify sia all'altezza delle tue necessità di networking, visita il nostro <a class="link"  href="#shop">shop</a>, scegli le cards perfette per il tuo team e procedi con l'acquisto.</p>`,
    },
    {
      title: 'Attiva.',
      description:
        '<p>Inserisci la licenza ricevuta via e-mail, Spartisci le cards acquistate e goditi Notify al massimo delle sue potenzialità!</p>',
    },
  ];
}
