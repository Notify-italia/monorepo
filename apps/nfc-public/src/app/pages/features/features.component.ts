import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  public features = [
    {
      title: 'Rendi veramente tuo il biglietto da vista aziendale',
      description:
        'Con Notify puoi personalizzare il tuo biglietto da visita come vuoi tu. Aggiungi il tuo logo, i tuoi social, i tuoi contatti e molto altro.',
      // image: 'assets/images/personalization.webp',
      icon: {
        name: 'color_lens',
        set: 'materialui',
      },
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Elimina gli sprechi di carta',
      description:
        'Condividi un biglietto da visita digitale in modo digitale e risparmiare carta e denaro, mai più biglietti da visita smarriti, o usurati!',
      // image: 'assets/images/paperless.webp',
      icon: {
        name: 'eco',
        set: 'materialui',
      },
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'Ricevi feedbacks dai tuoi clienti',
      description:
        'Ricevi feedbacks ai tuoi clienti ai quali hai condiviso il tuo biglietto da visita digitale. Scopri cosa pensano di te e del tuo lavoro, il tutto in tempo reale e alla portata di un tap.',
      // image: 'assets/images/feedbacks.webp',
      icon: {
        name: 'star',
        set: 'materialui',
      },
      color: 'bg-yellow-500/10 text-yellow-600',
    },
    {
      title:
        'Ottieni statistiche concrete sul tuo networking e sulle tue relazioni professionali',
      description: `Condividi il tuo profilo e scopri quali sono i contatti e le informazioni più richieste dai tuoi clienti. Il tutto da una pratica dashboard.`,
      // image: 'assets/images/dashboard.webp',
      icon: {
        name: 'show_chart',
        set: 'materialui',
      },
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      title:
        'Invia files in tempo reale a chi sta visualizzando il tuo profilo',
      description:
        "Condividi con i tuoi clienti files e documenti, semplicemente aprendo l'applicazione e selezionando un dispositivo tra quelli connessi al tuo profilo.",
      // image: 'assets/images/file-sharing.webp',
      icon: {
        name: 'download',
        set: 'octicons',
      },
      color: 'bg-orange-500/10 text-orange-600',
    },
  ]
    .map((feature, index, arr) => {
      const isDesktop = ['xl', 'lg', '2xl'].includes(
        this._utils.currentTailwindMediaQuery()
      );

      const rotation = 45;
      const sideMargin = isDesktop ? 50 : 14;
      const verticalMargin = isDesktop ? 22 : 7;

      const arrLength = arr.length - 1;
      const half = arrLength / 2;

      const vmCoeff = verticalMargin / (arrLength / 2);
      const vmValue =
        index < half ? vmCoeff * index : vmCoeff * (arrLength - index);

      const smValue = this.getMarginValue(index, arrLength, sideMargin);

      return {
        ...feature,
        rotation: -rotation + index * ((rotation * 2) / arrLength),
        marginLeft: half > index ? 0 : smValue,
        marginBottom: vmValue,
        marginRight: half < index ? 0 : smValue,
        justify: half < index ? 'end' : 'start',
      };
    })
    .sort((a, b) => Math.abs(b.rotation) - Math.abs(a.rotation));

  constructor(private _utils: UtilsService) {}

  private getMarginValue(index: number, items: number, multiplier: number) {
    const half = items / 2;
    const diff = index <= half ? half - index : half - (items - index);

    return diff * multiplier;
  }
}
