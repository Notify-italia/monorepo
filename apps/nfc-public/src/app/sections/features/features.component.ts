import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SvgBoxIconComponent, UtilsService } from '@notify/ngx-shared';
import { FeatureCardComponent } from '../../components/feature-card/feature-card.component';

@Component({
  selector: 'notify-features',
  standalone: true,
  imports: [CommonModule, FeatureCardComponent, SvgBoxIconComponent],
  providers: [UtilsService],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
})
export class FeaturesComponent {
  constructor(private _domSanitizer: DomSanitizer) {}

  public get featuresSplit() {
    const features = this._buildFeatures;
    const columns = 2;

    return features.reduce((acc: (typeof features)[], curr) => {
      const latestAccItem = acc[acc.length - 1];

      if (!latestAccItem) {
        return [[curr]];
      }

      if (latestAccItem.length >= columns) {
        return [...acc, [curr]];
      }

      acc[acc.length - 1].push(curr);

      return acc;
    }, []);
  }

  private get _buildFeatures() {
    return [
      {
        title: 'Profilo digitale personalizzato',
        description: `Con Notify puoi personalizzare il tuo biglietto da visita come vuoi tu. Aggiungi il tuo logo, i tuoi social, i tuoi contatti e molto altro.  <br /><br /> Scegli tra una varietà di design per creare un biglietto che rifletta al meglio la tua personalità e il tuo brand. Non c'è limite alla tua creatività!`,
        // image: 'assets/images/personalization.webp',
        icon: `<svg _ngcontent-ng-c1399343009="" fill="currentColor" class="h-8 w-8" data-src="https://s2.svgbox.net/materialui.svg?ic=color_lens" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_1"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 3a9 9 0 000 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></svg>`,
        color: 'bg-blue-400/20 text-blue-400',
      },
      {
        title: 'Note in coworking',
        description: `Aggiungi un tocco personale ad ogni incontro! <br /><br /> Con le note personalizzate, puoi annotare dettagli importanti, ricordi o promemoria per poi condividerli col cliente o con i tuoi colleghi. <br /> Mai più dimenticare un dettaglio chiave!`,
        // image: 'assets/images/file-sharing.webp',
        icon: `<svg _ngcontent-ng-c1399343009="" fill="currentColor" class="h-8 w-8" data-src="https://s2.svgbox.net/materialui.svg?ic=notes" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_2"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"></path></svg>`,
        color: 'bg-red-400/20 text-red-200',
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
        color: 'bg-purple-400/20 text-purple-200',
      },
      {
        title: 'Invio file in tempo reale',
        description: `Hai mai desiderato condividere una risorsa importante durante una conversazione senza dover attendere? <br /><br /> Con la nostra funzione di invio file in tempo reale, puoi farlo senza sudare! Condividi presentazioni, brochure o qualsiasi altro documento direttamente mentre parli, rendendo ogni interazione più fluida e produttiva!`,
        // image: 'assets/images/file-sharing.webp',
        icon: `<svg _ngcontent-ng-c1399343009="" fill="currentColor" class="h-8 w-8" data-src="https://s2.svgbox.net/octicons.svg?ic=download" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" color="" data-id="svg-loader_5"><path d="M4.97 11.03a.75.75 0 111.06-1.06L11 14.94V2.75a.75.75 0 011.5 0v12.19l4.97-4.97a.75.75 0 111.06 1.06l-6.25 6.25a.75.75 0 01-1.06 0l-6.25-6.25zm-.22 9.47a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H4.75z"></path></svg>`,
        color: 'bg-orange-400/20 text-orange-200',
      },
      {
        title: 'Risparmio di carta',
        description: `Contribuisci alla salvaguardia dell'ambiente riducendo l'uso di carta. <br /><br /> Passando ai biglietti da visita digitali, dimostri il tuo impegno per un futuro più sostenibile, oltre a ridurre i costi di stampa e distribuzione dei biglietti cartacei!`,
        // image: 'assets/images/paperless.webp',
        icon: `<svg _ngcontent-ng-c1399343009="" fill="currentColor" class="h-8 w-8" data-src="https://s2.svgbox.net/materialui.svg?ic=eco" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" color="" data-id="svg-loader_6"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6.05 8.05a7.001 7.001 0 00-.02 9.88c1.47-3.4 4.09-6.24 7.36-7.93A15.952 15.952 0 008 19.32c2.6 1.23 5.8.78 7.95-1.37C19.43 14.47 20 4 20 4S9.53 4.57 6.05 8.05z"></path></svg>`,
        color: 'bg-green-400/20 text-green-400',
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
  }
}
