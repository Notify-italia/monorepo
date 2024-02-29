import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BasePageComponent } from '../../components/base-page/base-page.component';

@Component({
  selector: 'notify-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss',
})
export class QuestionsComponent extends BasePageComponent {
  public get itemHalved() {
    return {
      first: this.items.slice(0, this.items.length / 2),
      second: this.items.slice(this.items.length / 2, this.items.length),
    };
  }

  public items: {
    question: SafeUrl;
    answer: SafeUrl;
  }[] = [
    {
      question:
        'Quali sono i vantaggi dei biglietti da visita digitali rispetto a quelli tradizionali?',
      answer:
        "I biglietti da visita digitali offrono numerosi vantaggi rispetto a quelli tradizionali in carta. <br />  Primo, sono ecologici, riducendo l'impatto sull'ambiente. Inoltre, sono più versatili e personalizzabili, consentendo l'aggiunta di elementi multimediali come link, immagini e video. Sono facilmente condivisibili tramite email, messaggi o social media e consentono di ricevere feedback istantanei.",
    },
    {
      question: 'Posso personalizzare il mio biglietto da visita digitale?',
      answer:
        'Assolutamente! La nostra piattaforma offre ampie opzioni di personalizzazione per i tuoi biglietti da visita digitali. Puoi aggiungere il tuo logo, immagini, informazioni di contatto e persino collegamenti ai tuoi profili sui social media. <br /><br />  Scegli tra una varietà di layout e design per creare un biglietto che rifletta al meglio la tua personalità e il tuo brand.',
    },
    {
      question:
        'Come funziona il processo di condivisione dei biglietti da visita digitali?',
      answer:
        "Il processo di condivisione dei biglietti da visita digitali è semplice e veloce! <br /><br />  Dopo aver creato il tuo biglietto digitale tramite l'app o il sito web, puoi condividerlo facilmente facendo scansionare la tua tessera oppure tramite email, QR code, messaggi di testo o social media. <br />  I destinatari possono successivamente salvare i tuoi contatti istantaneamente, con la semplice pressione di un tasto.",
    },
    {
      question:
        'Come posso ricevere feedback dai destinatari dei miei biglietti da visita digitali?',
      answer:
        "La nostra app consente di ricevere feedback istantanei dai destinatari dei tuoi biglietti da visita digitali. Dopo aver scansionato il tuo biglietto, i destinatari possono fornire feedback direttamente tramite l'app, consentendoti di valutare l'efficacia dei tuoi biglietti e apportare eventuali miglioramenti.",
    },
    {
      question: `Quali sono le opzioni di analytics disponibili per monitorare l'efficacia dei miei biglietti da visita digitali?`,
      answer:
        "Offriamo una serie di opzioni di analytics per monitorare l'efficacia dei tuoi biglietti da visita digitali. <br />  Puoi visualizzare il numero di scansioni, le interazioni e i feedback ricevuti, nonché le informazioni demografiche dei tuoi contatti. Questi dati ti consentono di valutare il successo della tua strategia di networking e di apportare eventuali aggiustamenti.",
    },
    {
      question:
        "Come posso inserire i miei dati all'interno dell'NFC del biglietto da visita digitale?",
      answer:
        "È semplice! <br /><br /> Dopo aver creato il profilo sulla nostra piattaforma, avrai l'opzione di includere i tuoi dati all'interno di un qualsiasi dispositivo NFC. Sarà sufficente poi selezionare il pulsante dell'NFC disponibile sulla Dashboard o sulla pagina di modifica profilo e seguire le istruzioni a schermo. Una volta completato il processo, i destinatari potranno semplicemente avvicinare il loro smartphone al biglietto per accedere rapidamente e facilmente alle tue informazioni di contatto.  <br /><br /> È un modo conveniente e innovativo per scambiare dati durante le interazioni di networking!",
    },
  ].map((item) => ({
    question: this._domSanitizer.bypassSecurityTrustHtml(item.question),
    answer: this._domSanitizer.bypassSecurityTrustHtml(item.answer),
  }));

  constructor(private _domSanitizer: DomSanitizer) {
    super();
  }
}

/*
Domanda:  Risposta: I biglietti da visita digitali offrono numerosi vantaggi rispetto a quelli tradizionali in carta. Primo, sono ecologici, riducendo l'impatto sull'ambiente. Inoltre, sono più versatili e personalizzabili, consentendo l'aggiunta di elementi multimediali come link, immagini e video. Sono facilmente condivisibili tramite email, messaggi o social media e consentono di ricevere feedback istantanei.
Domanda: Come funziona il processo di condivisione dei biglietti da visita digitali? Risposta: Il processo di condivisione dei biglietti da visita digitali è semplice e veloce. Dopo aver creato il tuo biglietto digitale tramite l'app o il sito web, puoi condividerlo facilmente tramite email, QR code, messaggi di testo o social media. I destinatari possono quindi scansionare il biglietto digitale con il loro smartphone e salvare i tuoi contatti istantaneamente.
Domanda: Posso personalizzare il mio biglietto da visita digitale? Risposta: Assolutamente! La nostra piattaforma offre ampie opzioni di personalizzazione per i tuoi biglietti da visita digitali. Puoi aggiungere il tuo logo, immagini, informazioni di contatto e persino collegamenti ai tuoi profili sui social media. Scegli tra una varietà di layout e design per creare un biglietto che rifletta al meglio la tua personalità e il tuo brand.
Domanda: Come posso ricevere feedback dai destinatari dei miei biglietti da visita digitali? Risposta: La nostra app ti consente di ricevere feedback istantanei dai destinatari dei tuoi biglietti da visita digitali. Dopo aver scansionato il tuo biglietto, i destinatari possono fornire feedback direttamente tramite l'app, consentendoti di valutare l'efficacia del tuo biglietto e apportare eventuali miglioramenti.
Domanda: Quali sono le opzioni di analytics disponibili per monitorare l'efficacia dei miei biglietti da visita digitali? Risposta: Offriamo una serie di opzioni di analytics per monitorare l'efficacia dei tuoi biglietti da visita digitali. Puoi visualizzare il numero di scansioni, le interazioni e i feedback ricevuti, nonché le informazioni demografiche dei tuoi contatti. Questi dati ti consentono di valutare il successo della tua strategia di networking e di apportare eventuali aggiustamenti. 
Domanda: Come posso inserire i miei dati all'interno dell'NFC del biglietto da visita digitale? Risposta: È semplice! Dopo aver creato il tuo biglietto da visita digitale attraverso la nostra piattaforma, avrai l'opzione di includere i tuoi dati all'interno dell'NFC (Near Field Communication). Basterà seguire i passaggi indicati per inserire le informazioni desiderate, come il tuo nome, l'azienda, il numero di telefono e l'indirizzo email. Una volta completato il processo, i destinatari potranno semplicemente avvicinare il loro smartphone al biglietto per accedere rapidamente e facilmente alle tue informazioni di contatto. È un modo conveniente e innovativo per scambiare dati durante le interazioni di networking!

 */
