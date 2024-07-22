import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  MockupFillComponent,
  SSRBaseComponent,
  SvgBoxIconComponent,
  UtilsService,
} from '@notify/ngx-shared';
import { interval, Subject, takeUntil, tap } from 'rxjs';
import { FeatureCardComponent } from '../../components/feature-card/feature-card.component';

@Component({
  selector: 'notify-features',
  standalone: true,
  imports: [
    CommonModule,
    FeatureCardComponent,
    SvgBoxIconComponent,
    MockupFillComponent,
  ],
  providers: [UtilsService],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
})
export class FeaturesComponent extends SSRBaseComponent implements OnInit {
  private _platformId = inject(PLATFORM_ID);
  private _domSanitizer = inject(DomSanitizer);

  @ViewChild('FeaturesContainer')
  public featuresContainer!: ElementRef<HTMLDivElement>;

  public carouselTouched$ = new Subject<void>();

  public selectedId = '';
  private _selectedIndex = 0;

  public get selectedFeature() {
    return this.features.find((f) => f.id === this.selectedId);
  }

  public get features() {
    return [
      {
        id: 'profile',
        title: 'Personalizzazione illimitata',
        description: `Notify offre un'ampia gamma di opzioni per personalizzare il tuo biglietto digitale. <br /> Scegli tra diversi stili, colori e layout per creare un biglietto che rispecchi al meglio la tua personalità e il tuo brand.`,
        // image: 'assets/images/personalization.webp',
        icon: `<svg fill="currentColor" class="size-8 pointer-events-none" data-src="https://s2.svgbox.net/materialui.svg?ic=color_lens" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_1"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 3a9 9 0 000 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></svg>`,
        color: 'bg-blue-400/20 text-blue-400',
        desktopImage: this._getFromS3('desktop-profile.webp'),
        phoneImage: this._getFromS3('phone-profile.webp'),
      },
      {
        id: 'projects',
        title: 'Un tocco personale ad ogni incontro',
        description: `Ogni cliente è unico e così deve essere il modo in cui viene trattato. <br /> Con <i>Progetti</i>, puoi annotare dettagli importanti, ricordi o promemoria per poi condividerli col cliente o con i tuoi colleghi.`,
        icon: `<svg fill="currentColor" class="size-8 pointer-events-none" data-src="https://s2.svgbox.net/materialui.svg?ic=notes" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_2"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"></path></svg>`,
        color: 'bg-red-400/20 text-red-400',
        desktopImage: this._getFromS3('desktop-projects.webp'),
        phoneImage: this._getFromS3('phone-projects.webp'),
      },
      {
        id: 'leads',
        title: 'Un CRM sempre a portata di mano',
        description: `Con la potenza della nostra IA, digitalizza in un lampo i biglietti da visita che ricevi. <br /> <i>Contatti</i> ti permette di gestire la tua rete in modo semplice e intuitivo, per non perdere mai un'opportunità di business.`,
        // image: 'assets/images/paperless.webp',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 pointer-events-none">
  <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
</svg>
`,
        color: 'bg-green-400/20 text-green-400',
        desktopImage: this._getFromS3('desktop-leads.webp'),
        phoneImage: this._getFromS3('phone-leads.webp'),
      },
      {
        id: 'file-sharing',
        title: '<i>Sharing</i>, alla velocità della luce',
        description: `Condividi documenti, presentazioni e file multimediali con i tuoi contatti in modo rapido e sicuro. <br /> <i>Invia File</i> ti permette di inviare file di qualsiasi dimensione senza dover ricorrere a servizi di terze parti.`,
        // image: 'assets/images/file-sharing.webp',
        icon: `<svg fill="currentColor" class="size-8 pointer-events-none" data-src="https://s2.svgbox.net/octicons.svg?ic=download" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" color="" data-id="svg-loader_5"><path d="M4.97 11.03a.75.75 0 111.06-1.06L11 14.94V2.75a.75.75 0 011.5 0v12.19l4.97-4.97a.75.75 0 111.06 1.06l-6.25 6.25a.75.75 0 01-1.06 0l-6.25-6.25zm-.22 9.47a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H4.75z"></path></svg>`,
        color: 'bg-orange-400/20 text-orange-400',
        desktopImage: this._getFromS3('desktop-sharing.webp'),
        phoneImage: this._getFromS3('phone-sharing.webp'),
      },
      {
        id: 'coworking',
        title: 'Nato per il lavoro di squadra',
        description: `Notify è stato progettato con una mentalità team-first, <br /> è un vero e proprio <i>hub</i> per la collaborazione e la condivisione di informazioni tra i membri del tuo team.`,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 pointer-events-none">
  <path fill-rule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clip-rule="evenodd" />
  <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
</svg>

`,
        color: 'bg-teal-400/20 text-teal-400',
        desktopImage: this._getFromS3('desktop-coworking.webp'),
        phoneImage: this._getFromS3('phone-coworking.webp'),
      },
      {
        id: 'team',
        title: 'Il tuo team, le tue regole',
        description: `Non perdere tempo a cercare la password di ogni utente tra post-it e vecchie e-mail, <br /> Attraverso il portale amministrativo di Notify puoi gestire a 360° ogni utente nella tua organizzazione, in completa autonomia.`,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 pointer-events-none">
  <path fill-rule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
  <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
</svg>

`,
        color: 'bg-lime-400/20 text-lime-400',
        desktopImage: this._getFromS3('desktop-team.webp'),
      },
      {
        id: 'feedback',
        title: 'Dimentica le congetture',
        description: `Ricevi feedback in tempo reale dalle persone che visualizzano il tuo profilo, <br /> Scopri cosa funziona e cosa può essere migliorato per stupire ancora di più nel prossimo incontro.`,
        icon: `<svg fill="currentColor" class="size-8 pointer-events-none" data-src="https://s2.svgbox.net/materialui.svg?ic=star" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_3"><path d="M0 0h24v24H0z" fill="none"></path><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>`,
        color: 'bg-yellow-400/20 text-yellow-400',
        desktopImage: this._getFromS3('desktop-feedback.webp'),
        phoneImage: this._getFromS3('phone-feedbacks.webp'),
      },
      {
        id: 'analytics',
        title: "Statistiche, a colpo d'occhio",
        description: `Ottieni insights dettagliati sulle interazioni con il tuo biglietto digitale,<br /> Non si tratta solo di fare una bella impressione ma di capire come farla al meglio.`,
        // image: 'assets/images/dashboard.webp',
        icon: `<svg fill="currentColor" class="size-8 pointer-events-none" data-src="https://s2.svgbox.net/materialui.svg?ic=show_chart" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_4"><path d="M0 0h24v24H0z" fill="none"></path><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"></path></svg>`,
        color: 'bg-purple-400/20 text-purple-400',
        desktopImage: this._getFromS3('desktop-analytics.webp'),
        phoneImage: this._getFromS3('phone-analytics.webp'),
      },
    ].map((feature) => {
      this.componentStable.next();
      return {
        ...feature,
        description: this._domSanitizer.bypassSecurityTrustHtml(
          feature.description
        ),
        title: this._domSanitizer.bypassSecurityTrustHtml(feature.title),
        icon: this._domSanitizer.bypassSecurityTrustHtml(feature.icon),
      };
    });
  }

  public get selectedFeatureOffset() {
    if (!isPlatformBrowser(this._platformId)) {
      return 0;
    }
    const greaterThanMaxWidth = window.innerWidth > 1280;
    const featureBtn = document.getElementById(`feature-${this.selectedId}`);
    const x = featureBtn?.offsetLeft ?? 0;
    const width =
      (featureBtn?.offsetWidth ?? 0) / (greaterThanMaxWidth ? 2 : 1.1);

    const pageCenter = (greaterThanMaxWidth ? 1280 : window.innerWidth) / 2;

    return pageCenter - x - width;
  }

  ngOnInit(): void {
    this.updateSelected(this.features[0].id);
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }
    interval(2500)
      .pipe(
        takeUntil(this.carouselTouched$),
        tap(() => {
          this._selectedIndex += 1;

          this.updateSelected(
            this.features[this._selectedIndex % this.features.length].id
          );
        })
      )
      .subscribe();
  }

  public updateSelected(id: string) {
    this.selectedId = id;
  }

  private _getFromS3(file: string) {
    return `https://s3-api.vps.notifyapp.it/assets/notifyapp-landing/${file}`;
  }
}
