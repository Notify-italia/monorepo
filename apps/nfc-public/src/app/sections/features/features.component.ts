import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  MockupFillComponent,
  SSRBaseComponent,
  SvgBoxIconComponent,
  UtilsService,
} from '@notify/ngx-shared';
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
export class FeaturesComponent extends SSRBaseComponent {
  constructor(private _domSanitizer: DomSanitizer) {
    super();
  }

  public selectedId = 'profile';

  public get selectedFeature() {
    return this.features.find((feature) => feature.id === this.selectedId);
  }

  public get features() {
    return [
      {
        id: 'feedback',
        title: 'Dimentica le congetture',
        description: `Ricevi feedback in tempo reale dalle persone che visualizzano il tuo profilo. <br /> Scopri cosa funziona e cosa può essere migliorato per stupire ancora di più nel prossimo incontro!`,
        icon: `<svg fill="currentColor" class="size-8 pointer-events-none" data-src="https://s2.svgbox.net/materialui.svg?ic=star" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_3"><path d="M0 0h24v24H0z" fill="none"></path><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>`,
        color: 'bg-yellow-400/20 text-yellow-400',
        desktopImage: this._getFromS3('desktop-projects.webp'),
        phoneImage: this._getFromS3('phone-feedbacks.webp'),
      },
      {
        id: 'analytics',
        title: "Utilizzo, a colpo d'occhio",
        description: `Ottieni insights dettagliati sulle interazioni con il tuo biglietto digitale,<br /> Non si tratta solo di fare una bella impressione ma di capire come farla al meglio.`,
        // image: 'assets/images/dashboard.webp',
        icon: `<svg fill="currentColor" class="size-8 pointer-events-none" data-src="https://s2.svgbox.net/materialui.svg?ic=show_chart" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_4"><path d="M0 0h24v24H0z" fill="none"></path><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"></path></svg>`,
        color: 'bg-purple-400/20 text-purple-400',
        desktopImage: this._getFromS3('desktop-projects.webp'),
        phoneImage: this._getFromS3('phone-analytics.webp'),
      },
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
        title: 'Appunti, in coworking',
        description: `Aggiungi un tocco personale ad ogni incontro. <br /> Con <i>Progetti</i>, puoi annotare dettagli importanti, ricordi o promemoria per poi condividerli col cliente o con i tuoi colleghi.`,
        icon: `<svg fill="currentColor" class="size-8 pointer-events-none" data-src="https://s2.svgbox.net/materialui.svg?ic=notes" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_2"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"></path></svg>`,
        color: 'bg-red-400/20 text-red-400',
        desktopImage: this._getFromS3('desktop-projects.webp'),
        phoneImage: this._getFromS3('phone-projects.webp'),
      },
      {
        id: 'leads',
        title: 'Un OCR mai visto prima',
        description: `Con la potenza della nostra IA, digitalizza in un lampo i biglietti da visita che ricevi. <br /> <i>Contatti</i> ti permette di organizzare e gestire la tua rete in modo semplice e intuitivo, per non perdere mai un'opportunità di business.`,
        // image: 'assets/images/paperless.webp',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 pointer-events-none">
  <path fill-rule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clip-rule="evenodd" />
  <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
</svg>
`,
        color: 'bg-green-400/20 text-green-400',
        desktopImage: this._getFromS3('desktop-projects.webp'),
        phoneImage: this._getFromS3('phone-leads.webp'),
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

  private _getFromS3(file: string) {
    return `https://s3-api.vps.notifyapp.it/assets/notifyapp-landing/${file}`;
  }
}
