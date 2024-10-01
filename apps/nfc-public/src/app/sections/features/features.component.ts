import {
  CommonModule,
  isPlatformBrowser,
  NgOptimizedImage,
} from '@angular/common';
import {
  AfterViewInit,
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
  SplineViewerComponent,
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
    SplineViewerComponent,
    NgOptimizedImage,
  ],
  providers: [UtilsService],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
})
export class FeaturesComponent
  extends SSRBaseComponent
  implements OnInit, AfterViewInit
{
  private _platformId = inject(PLATFORM_ID);
  private _domSanitizer = inject(DomSanitizer);
  private _utilsService = inject(UtilsService);

  @ViewChild('FeaturesContainer')
  public featuresContainer!: ElementRef<HTMLDivElement>;

  public carouselTouched$ = new Subject<void>();

  public carouselRunning = false;
  public carouselSpeed = 2500;
  public timeLeftUntilNextFeature = this.carouselSpeed;
  public nextFeatureTimer = 100;

  public selectedId = '';
  private _selectedIndex = 0;

  public get selectedFeature() {
    return this.features.find((f) => f.id === this.selectedId);
  }

  public features = [
    {
      id: 'profile',
      title: 'Il tuo biglietto, la tua personalità',
      description: `Notify offre un editor avanzato con infinite possibilità di personalizzazione del tuo biglietto digitale. <br /> Scegli tra diversi stili, colori e layout per creare un biglietto che rispecchi al meglio la tua personalità e il tuo brand.`,
      // image: 'assets/images/personalization.webp',
      icon: `<svg fill="currentColor" class="size-8 pointer-events-none" data-src="https://s2.svgbox.net/materialui.svg?ic=color_lens" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_1"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 3a9 9 0 000 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></svg>`,
      color: '!bg-blue-300/70 !text-blue-600',
      desktopImage: this._getImage('desktop-profile.webp'),
      phoneImage: this._getImage('phone-profile.webp'),
    },
    {
      id: 'projects',
      title: 'Tocco personale in ogni incontro',
      description: `Ogni cliente è unico e così deve essere il modo in cui viene trattato. <br /> Con <i>Progetti</i>, puoi annotare dettagli importanti, ricordi o promemoria per poi condividerli col cliente o con i tuoi colleghi.`,
      icon: `<svg fill="currentColor" class="size-8 pointer-events-none" data-src="https://s2.svgbox.net/materialui.svg?ic=notes" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_2"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"></path></svg>`,
      color: '!bg-red-300/70 !text-red-600',
      desktopImage: this._getImage('desktop-projects.webp'),
      phoneImage: this._getImage('phone-projects.webp'),
    },
    {
      id: 'leads',
      title: 'Acquisizione contatti, senza sforzo',
      description: `Con la potenza della nostra IA, digitalizza in un lampo i biglietti da visita che ricevi. <br /> <i>Contatti</i> ti permette di gestire la tua rete in modo semplice e intuitivo, per non perdere mai un'opportunità di business.`,
      // image: 'assets/images/paperless.webp',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 pointer-events-none">
  <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
</svg>
`,
      color: '!bg-green-300/70 !text-green-600',
      desktopImage: this._getImage('desktop-leads.webp'),
      phoneImage: this._getImage('phone-leads.webp'),
    },
    {
      id: 'file-sharing',
      title: '<i>Sharing</i>, alla velocità della luce',
      description: `Condividi documenti, presentazioni e file multimediali con i tuoi contatti in modo rapido e sicuro. <br /> <i>Invia File</i> ti permette di inviare file di qualsiasi dimensione senza dover ricorrere a servizi di terze parti.`,
      // image: 'assets/images/file-sharing.webp',
      icon: `<svg fill="currentColor" class="size-8 pointer-events-none" data-src="https://s2.svgbox.net/octicons.svg?ic=download" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" color="" data-id="svg-loader_5"><path d="M4.97 11.03a.75.75 0 111.06-1.06L11 14.94V2.75a.75.75 0 011.5 0v12.19l4.97-4.97a.75.75 0 111.06 1.06l-6.25 6.25a.75.75 0 01-1.06 0l-6.25-6.25zm-.22 9.47a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H4.75z"></path></svg>`,
      color: '!bg-orange-300/70 !text-orange-600',
      desktopImage: this._getImage('desktop-sharing.webp'),
      phoneImage: this._getImage('phone-sharing.webp'),
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
      color: '!bg-teal-300/70 !text-teal-600',
      desktopImage: this._getImage('desktop-coworking.webp'),
      phoneImage: this._getImage('phone-coworking.webp'),
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
      color: '!bg-lime-300/70 !text-lime-600',
      desktopImage: this._getImage('desktop-team.webp'),
      phoneImage: this._getImage('phone-team.webp'),
    },
    {
      id: 'feedback',
      title: 'Dimentica le congetture',
      description: `Ricevi feedback in tempo reale dalle persone che visualizzano il tuo profilo, <br /> Scopri cosa funziona e cosa può essere migliorato per stupire ancora di più nel prossimo incontro.`,
      icon: `<svg fill="currentColor" class="size-8 pointer-events-none" data-src="https://s2.svgbox.net/materialui.svg?ic=star" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_3"><path d="M0 0h24v24H0z" fill="none"></path><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>`,
      color: '!bg-yellow-300/70 !text-yellow-600',
      desktopImage: this._getImage('desktop-feedback.webp'),
      phoneImage: this._getImage('phone-feedbacks.webp'),
    },
    {
      id: 'analytics',
      title: "Statistiche, a colpo d'occhio",
      description: `Ottieni insights dettagliati sulle interazioni con il tuo biglietto digitale,<br /> Non si tratta solo di fare una bella impressione ma di capire come farla al meglio.`,
      icon: `<svg fill="currentColor" class="size-8 pointer-events-none" data-src="https://s2.svgbox.net/materialui.svg?ic=show_chart" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_4"><path d="M0 0h24v24H0z" fill="none"></path><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"></path></svg>`,
      color: '!bg-purple-300/70 !text-purple-600',
      desktopImage: this._getImage('desktop-analytics.webp'),
      phoneImage: this._getImage('phone-analytics.webp'),
    },
    {
      id: 'notifications',
      title: `Non perdere mai un'opportunità`,
      description: `Come suggerisce il nostro nome, siamo qui per <i>notificarti</i> tutto ciò che è importante per te.
        <br /> Con le nostre notifiche push in tempo reale per tenerti sempre aggiornato sulle interazioni con il tuo biglietto digitale o con il tuo team.`,

      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 pointer-events-none">
  <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
  <path fill-rule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clip-rule="evenodd" />
</svg>
`,
      color: '!bg-indigo-300/70 !text-indigo-600',
      desktopImage: this._getImage('desktop-notifications.webp'),
      phoneImage: this._getImage('phone-notifications.webp'),
    },
  ].map((feature) => {
    return {
      ...feature,
      description: this._domSanitizer.bypassSecurityTrustHtml(
        feature.description
      ),
      title: this._domSanitizer.bypassSecurityTrustHtml(feature.title),
      icon: this._domSanitizer.bypassSecurityTrustHtml(feature.icon),
    };
  });

  public get pxOffsetToCenterSelectedFeature() {
    if (!isPlatformBrowser(this._platformId)) {
      return 0;
    }

    const _feature = document.querySelector(
      `#feature-${this.selectedId}`
    ) as HTMLButtonElement;

    if (!_feature) {
      return 0;
    }

    const screenWidth = window.innerWidth > 1280 ? 1280 : window.innerWidth;
    const featureWidth = _feature.offsetWidth / 2;
    const offset = _feature.offsetLeft;
    const _subtraction = offset + featureWidth;

    if (this._utilsService.isMobile) {
      return screenWidth - _subtraction;
    }

    return screenWidth / 2 - _subtraction;
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.updateSelected(this.features[0].id);

    this.preloadImages(
      this.features
        .map((f) => f.desktopImage)
        .concat(this.features.map((f) => f.phoneImage))
    );

    this.componentIsStable();
  }

  ngAfterViewInit(): void {
    this.updateSelected(this.features[0].id);
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    this.startCarousel();
  }

  public startCarousel() {
    const _refreshInterval = 10;
    interval(_refreshInterval)
      .pipe(
        takeUntil(this.carouselTouched$),
        tap(() => {
          this.timeLeftUntilNextFeature -= _refreshInterval;
          if (this.timeLeftUntilNextFeature <= 0) {
            this._nextFeature();
            this.timeLeftUntilNextFeature = this.carouselSpeed;
          }

          this.nextFeatureTimer =
            (this.timeLeftUntilNextFeature / this.carouselSpeed) * 100;
        })
      )
      .subscribe();

    this.carouselRunning = true;
  }

  public stopCarousel() {
    this.carouselTouched$.next();
    this.carouselRunning = false;
  }

  public updateSelected(id: string) {
    this.selectedId = id;
    this._selectedIndex = this.features.findIndex((f) => f.id === id);

    if (!this.featuresContainer) {
      return;
    }

    this.featuresContainer.nativeElement.style.transform = `translateX(${
      this.pxOffsetToCenterSelectedFeature + 'px'
    })`;
  }

  private _getImage(file: string) {
    return `/assets/features/${file}`;
  }

  private _nextFeature() {
    this._selectedIndex += 1;

    this.updateSelected(
      this.features[this._selectedIndex % this.features.length].id
    );
  }
}
