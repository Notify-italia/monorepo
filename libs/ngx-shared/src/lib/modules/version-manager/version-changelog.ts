import { INotifyVersionInfo } from './components/version-label/version-label.component';

const _getVersionArt = (tag: string) => {
  return `https://s3-api.vps.notifyapp.it/assets/version-art/${tag}.webp`;
};

const _sharedTag = 'v1.4.0';
const _sharedDate = '2025-02-27';
const _sharedTitle = 'Video Youtube, documenti e (nuovi) stili';
const _sharedDescription = `Questa versione di Notify porta la personalizzazione del tuo profilo ad un nuovo livello, con l'introduzione di nuovi blocchi e funzionalità per mostrare ai tuoi contatti le tue passioni e i tuoi interessi.`;

const _sharedChanges: INotifyVersionInfo['changes'] = [
  {
    type: 'new',
    message:
      "Inserito un nuovo blocco sull'editor del tuo profilo: 'Video Youtube', per mostrare ai tuoi contatti i tuoi video preferiti",
  },
  {
    type: 'new',
    message:
      "Inserito un nuovo blocco sull'editor del tuo profilo: 'Documenti', per mostrare ai tuoi contatti un documento pdf di tuo interesse",
  },
  {
    type: 'improvement',
    message: 'Aggiunta la possibilità di inserire un link ad x.com nel profilo',
  },
  {
    type: 'improvement',
    message:
      'Aggiunta la possibilità di inserire un link a photo.glass nel profilo',
  },
  {
    type: 'improvement',
    message:
      "Adesso, attivando l'opzione 'personalizza stile', viene usato come base lo stile corrente del profilo",
  },
  {
    type: 'fix',
    message:
      'Risolto un bug che causava una visualizzazione errata dello stato di visualizzazione di un blocco nel profilo, in alcuni casi',
  },
  {
    type: 'fix',
    message:
      'Risolto un bug che causava una visualizzazione errata del colore corrente nei color pickers alla prima apertura',
  },
  {
    type: 'fix',
    message:
      'Risolto un bug che causava clipping del testo in alcuni blocchi del profilo, in particolari condizioni',
  },
  {
    type: 'new',
    message:
      'Aggiunti 2 nuovi stili per i pulsanti del profilo: "Circolare (Riempito)" e "Circolare (Tracciato)"',
  },
  {
    type: 'improvement',
    message:
      'Aggiunte 3 nuove icone per i links inseribili nel profilo: "Ristorante", "Fast Food" e "Menù"',
  },
  {
    type: 'improvement',
    message:
      'Adesso è possibile reindirizzare ad un URL facendo tap o click su un blocco immagine del profilo',
  },
  {
    type: 'improvement',
    message:
      'Rimosse le restrizioni di personalizzazione per i pulsanti di richiesta feedback obbligatori',
  },
  {
    type: 'improvement',
    message:
      'Migliorata la visualizzazione dei blocchi disponibili sul profilo, con un nuovo stile e barra di ricerca anche da mobile',
  },
  {
    type: 'improvement',
    message:
      'Migliorata la status bar del mockup di visualizzazione dei profili per rispecchiare al meglio la realtà',
  },
  {
    type: 'improvement',
    message:
      'Il blocco "Sito web" ora ha 2 possibili orientamenti, quello classico orizzontale e il nuovo verticale',
  },
  {
    type: 'fix',
    message:
      'Risolto un bug che impediva la chiusura del menu di inserimento di un nuovo blocco su app iOS e Android',
  },
  {
    type: 'new',
    message:
      'Un nuovo look per la visualizzazione del tuo biglietto da visita digitale su desktop, con un design più pulito e moderno',
  },
];

export const agentChangelog: INotifyVersionInfo = {
  tag: _sharedTag,
  date: _sharedDate,
  description: _sharedDescription,
  title: _sharedTitle,
  artPath: _getVersionArt(_sharedTag),
  changes: [..._sharedChanges],
};

export const companyChangelog: INotifyVersionInfo = {
  tag: _sharedTag,
  date: _sharedDate,
  description: _sharedDescription,
  title: _sharedTitle,
  artPath: _getVersionArt(_sharedTag),
  changes: [
    ..._sharedChanges,
    {
      type: 'improvement',
      message:
        "L'export CSV dei tuoi contatti adesso include la data di creazione del contatto",
    },
  ],
};
