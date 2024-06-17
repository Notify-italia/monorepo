import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  SSRBaseComponent,
  SvgBoxIconComponent,
  UtilsService,
} from '@notify/ngx-shared';
import { FeatureCardComponent } from '../../components/feature-card/feature-card.component';

@Component({
  selector: 'notify-features',
  standalone: true,
  imports: [CommonModule, FeatureCardComponent, SvgBoxIconComponent],
  providers: [UtilsService],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
})
export class FeaturesComponent extends SSRBaseComponent {
  constructor(private _domSanitizer: DomSanitizer) {
    super();
  }

  public get buildFeatures() {
    return [
      {
        title: 'Personalizzazione illimitata',
        description: `Notify offre un'ampia gamma di opzioni per personalizzare il tuo biglietto digitale. <br /><br /> Scegli tra diversi stili, colori e layout per creare un biglietto che rispecchi al meglio la tua personalità e il tuo brand!`,
        // image: 'assets/images/personalization.webp',
        icon: `<svg _ngcontent-ng-c1399343009="" fill="currentColor" class="h-8 w-8" data-src="https://s2.svgbox.net/materialui.svg?ic=color_lens" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_1"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 3a9 9 0 000 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></svg>`,
        color: 'bg-blue-400/20 text-blue-400',
      },
      {
        title: ' Ricezione Feedback istantanea',
        description: `Dimentica le congetture! <br /><br /> Ricevi feedback in tempo reale dalle persone che scansionano il tuo biglietto digitale. <br /> Scopri cosa funziona e cosa può essere migliorato per stupire ancora di più nel prossimo incontro!`,

        // image: 'assets/images/feedbacks.webp',
        icon: `<svg _ngcontent-ng-c1399343009="" fill="currentColor" class="h-8 w-8" data-src="https://s2.svgbox.net/materialui.svg?ic=star" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_3"><path d="M0 0h24v24H0z" fill="none"></path><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>`,
        color: 'bg-yellow-400/20 text-yellow-400',
      },
      {
        title: 'Analytics avanzate',
        description: `Non si tratta solo di fare una bella impressione, ma di capire come farla al meglio! <br /> <br />  Con le nostre analytics, ottieni insights dettagliati sulle interazioni con il tuo biglietto digitale. Segui i trend, individua le opportunità e ottimizza la tua strategia di networking come mai prima d'ora!`,
        // image: 'assets/images/dashboard.webp',
        icon: `<svg _ngcontent-ng-c1399343009="" fill="currentColor" class="h-8 w-8" data-src="https://s2.svgbox.net/materialui.svg?ic=show_chart" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_4"><path d="M0 0h24v24H0z" fill="none"></path><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"></path></svg>`,
        color: 'bg-purple-400/20 text-purple-400',
      },
      {
        title: "Sostenibile sia per te che per l'ambiente",
        description: `Risparmia tempo, denaro e risorse! <br /><br /> Con Notify, non avrai più bisogno di stampare biglietti da visita. <br /> Riduci il tuo impatto ambientale (e aumenta il denero sul conto aziendale), il tutto mentre ti distingui con un biglietto digitale unico e innovativo!`,
        // image: 'assets/images/paperless.webp',
        icon: `<svg _ngcontent-ng-c1399343009="" fill="currentColor" class="h-8 w-8" data-src="https://s2.svgbox.net/materialui.svg?ic=eco" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_6"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6.05 8.05a7.001 7.001 0 00-.02 9.88c1.47-3.4 4.09-6.24 7.36-7.93A15.952 15.952 0 008 19.32c2.6 1.23 5.8.78 7.95-1.37C19.43 14.47 20 4 20 4S9.53 4.57 6.05 8.05z"></path></svg>`,
        color: 'bg-green-400/20 text-green-400',
      },
      {
        title: 'Progetti in coworking',
        description: `Aggiungi un tocco personale ad ogni incontro! <br /><br /> Con <i>Progetti</i>, puoi annotare dettagli importanti, ricordi o promemoria per poi condividerli col cliente o con i tuoi colleghi. <br /> Mai più dimenticare un dettaglio chiave!`,
        // image: 'assets/images/file-sharing.webp',
        icon: `<svg _ngcontent-ng-c1399343009="" fill="currentColor" class="h-8 w-8" data-src="https://s2.svgbox.net/materialui.svg?ic=notes" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_2"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"></path></svg>`,
        color: 'bg-red-400/20 text-red-400',
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
}
