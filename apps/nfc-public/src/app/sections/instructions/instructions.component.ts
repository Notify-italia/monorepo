import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AnimationsService,
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
  providers: [AnimationsService],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
})
export class InstructionsComponent extends SSRBaseComponent implements OnInit {
  private _animationsService = inject(AnimationsService);
  public steps = [
    {
      title: 'Prova.',
      description: `<p>Apri <a class="link" target="_blank" href="https://aziende.notifyapp.it/signup">aziende.notifyapp.it</a> su un qualsiasi browser e crea un account aziendale senza alcun impegno. Potrai dare un'occhiata a come Notify ti aiuterà a trasformare il tuo business.</p>`,
    },
    {
      title: 'Acquista.',
      description: `<p>Se Ritieni che Notify sia all'altezza delle tue necessità di networking, visita il nostro <a class="link" target="_blank" href="https://notifyapp.it/shop">shop</a>, scegli le cards perfette per il tuo team e procedi con l'acquisto.</p>`,
    },
    {
      title: 'Enjoy.',
      description:
        '<p>Inserisci la licenza ricevuta via e-mail, Spartisci le cards acquistate e goditi Notify al massimo delle sue potenzialità!</p>',
    },
  ];

  constructor() {
    super();
  }

  // override ngOnInit(): void {
  //   super.ngOnInit();

  //   if (!this._animationsService.isCapable) {
  //     return;
  //   }
  //   this._animationsService.declareAnimation('#instruction-cards', {
  //     scrollY: (driver) => {
  //       return {
  //         transform: `rotate(-${driver / 80}deg)`,
  //       };
  //     },
  //   });

  //   this._animationsService.initDriver(
  //     EnumAnimationsDrivers.ScrollY,
  //     window.scrollY
  //   );
  // }

  // @HostListener('window:scroll')
  // public onScroll(): void {
  //   if (!this._animationsService.isCapable) {
  //     return;
  //   }
  //   this._animationsService.updateDriver(
  //     EnumAnimationsDrivers.ScrollY,
  //     window.scrollY
  //   );
  // }
}
