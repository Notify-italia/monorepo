import { CommonModule } from '@angular/common';
import { Component, afterNextRender } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UtilsService } from '@notify/nfc-app-services';
import { SvgBoxIconComponent } from '@notify/ngx-components';
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
  public features: {
    rotation: number;
    left: number;
    bottom: number;
    justify: string;
    title: SafeHtml;
    description: SafeHtml;
    icon: {
      name: string;
      set: string;
    };
    color: string;
  }[] = [];

  constructor(private _domSanitizer: DomSanitizer) {
    afterNextRender(() => {
      this.features = this._buildFeatures();
    });
  }

  private _buildFeatures() {
    return [
      {
        title: 'Rendi veramente tuo il biglietto da vista aziendale',
        description: `Con Notify puoi personalizzare il tuo biglietto da visita come vuoi tu. <br /><br /> Aggiungi il tuo logo, i tuoi social, i tuoi contatti e molto altro.`,
        // image: 'assets/images/personalization.webp',
        icon: {
          name: 'color_lens',
          set: 'materialui',
        },
        color: 'bg-blue-400/20 text-blue-400',
      },
      {
        title: 'Risparmio di carta',
        description: `Contribuisci alla salvaguardia dell'ambiente riducendo l'uso di carta. <br /><br /> Passando ai biglietti da visita digitali, dimostri il tuo impegno per un futuro più sostenibile!`,
        // image: 'assets/images/paperless.webp',
        icon: {
          name: 'eco',
          set: 'materialui',
        },
        color: 'bg-green-400/20 text-green-400',
      },
      {
        title: ' Ricezione Feedback istantanea',
        description: `Dimentica le congetture! <br /><br /> Ricevi feedback in tempo reale dalle persone che scansionano il tuo biglietto digitale. <br /><br /> Scopri cosa funziona e cosa può essere migliorato per stupire ancora di più nel prossimo incontro!`,

        // image: 'assets/images/feedbacks.webp',
        icon: {
          name: 'star',
          set: 'materialui',
        },
        color: 'bg-yellow-400/20 text-yellow-400',
      },
      {
        title: 'Analytics avanzati',
        description: `Non si tratta solo di fare una bella impressione, ma di capire come farla al meglio! <br /> <br />  Con i nostri analytics avanzati, ottieni insights dettagliati sulle interazioni con il tuo biglietto digitale. Segui i trend, individua le opportunità e ottimizza la tua strategia di networking come mai prima d'ora!`,
        // image: 'assets/images/dashboard.webp',
        icon: {
          name: 'show_chart',
          set: 'materialui',
        },
        color: 'bg-purple-400/20 text-purple-200',
      },
      {
        title: 'Invio file in tempo reale',
        description: `Hai mai desiderato condividere una risorsa importante durante una conversazione senza dover attendere? <br /><br /> Con la nostra funzione di invio file in tempo reale, puoi farlo senza sudare! Condividi presentazioni, brochure o qualsiasi altro documento direttamente mentre parli, rendendo ogni interazione più fluida e produttiva!`,
        // image: 'assets/images/file-sharing.webp',
        icon: {
          name: 'download',
          set: 'octicons',
        },
        color: 'bg-orange-400/20 text-orange-200',
      },
      // {
      //   title: 'Note personalizzate',
      //   description: `Aggiungi un tocco personale ad ogni incontro! <br /><br /> Con le note personalizzate, puoi annotare dettagli importanti, ricordi o promemoria direttamente sul biglietto digitale. <br /> Mai più dimenticare un dettaglio chiave!`,
      //   // image: 'assets/images/file-sharing.webp',
      //   icon: {
      //     name: 'notes',
      //     set: 'materialui',
      //   },
      //   color: 'bg-red-400/20 text-red-200',
      // },
    ]
      .map((feature, index) => {
        // const isDesktop = ['xl', 'lg', '2xl'].includes(
        //   this._utils.currentTailwindMediaQuery()
        // );

        return {
          ...feature,
          description: this._domSanitizer.bypassSecurityTrustHtml(
            feature.description
          ),
          title: this._domSanitizer.bypassSecurityTrustHtml(feature.title),
          rotation: 90,
          left: -12,
          bottom: index * 8,
          justify: 'start',
        };
      })
      .sort((a, b) => Math.abs(b.rotation) - Math.abs(a.rotation));
  }

  private getMarginValue(index: number, items: number, multiplier: number) {
    const half = items / 2;
    const diff = index <= half ? half - index : half - (items - index);

    return diff * multiplier;
  }
}
