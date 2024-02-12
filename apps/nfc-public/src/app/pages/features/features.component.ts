import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FeatureCardComponent } from '../../components/feature-card/feature-card.component';

@Component({
  selector: 'notify-features',
  standalone: true,
  imports: [CommonModule, FeatureCardComponent],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
})
export class FeaturesComponent {
  public features = [
    {
      title: 'Rendere veramente tuo il biglietto da vista aziendale',
      description:
        'Con Notify puoi personalizzare il tuo biglietto da visita come vuoi tu. Aggiungi il tuo logo, i tuoi social, i tuoi contatti e molto altro.',
      image: 'assets/images/personalization.webp',
    },
    {
      title: 'Eliminare gli sprechi di carta',
      description:
        'Con Notify puoi condividere il tuo biglietto da visita in modo digitale e risparmiare carta e denaro, il tutto in modo ecologico e sostenibile.',
      image: 'assets/images/paperless.webp',
    },
    {
      title: 'Ricevere feedbacks dai tuoi clienti',
      description:
        'Con Notify puoi ricevere feedback dai tuoi clienti e migliorare il tuo business. il tutto alla portata di un tap.',
      image: 'assets/images/feedbacks.webp',
    },
    {
      title:
        'Ottenere statistiche concrete sul tuo networking e sulle tue relazioni professionali',
      description: `Condividi il tuo profilo e scopri quali sono i contatti e le informazioni più richieste dai tuoi clienti. Il tutto da una pratica dashboard.`,
      image: 'assets/images/dashboard.webp',
    },
    {
      title:
        'Inviare files in tempo reale a chi sta visualizzando il tuo profilo',
      description:
        "Condividi con i tuoi clienti files e documenti, semplicemente aprendo l'applicazione e selezionando un dispositivo tra quelli connessi al tuo profilo.",
      image: 'assets/images/file-sharing.webp',
    },
    {
      title: 'aumentare la visibilità dei tuoi prodotti',
      description: `Crea un'esperienza d'acquisto unica per i tuoi clienti con la vetrina digitale personalizzata.`,
      image: 'assets/images/products.webp',
    },
  ];
}
