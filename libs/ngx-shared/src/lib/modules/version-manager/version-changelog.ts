import { INotifyVersionInfo } from './components/version-label/version-label.component';

const _sharedChanges: INotifyVersionInfo['changes'] = [
  {
    type: 'new',
    message:
      "<b>Note</b>: è ora possibile usare l'elemento 'Foto' per aggiungere immagini alle note, per rendere più chiare e dettagliate le informazioni.",
  },
  {
    type: 'new',
    message:
      "<b>Note</b>: è ora possibile usare l'elemento 'Files' per allegare vari files ad una nota, i files possono essere di qualsiasi tipo.",
  },
  {
    type: 'improvement',
    message:
      "<b>Note</b>: L'elemento 'Checklist' offre nuove shortcut da tastiera, permettendo di spostarsi tra gli elementi, rimuoverli e aggiungerne di nuovi.",
  },
  {
    type: 'improvement',
    message:
      "<b>Note</b>: è ora possibile aggiungere liste ordinate e non all'elemento 'Testo'",
  },
  {
    type: 'improvement',
    message:
      '<b>Pannello Profilo</b>: è ora possibile mostrare una nota sul proprio profilo, al di sotto delle informazioni personali.',
  },
  {
    type: 'improvement',
    message: `<b>Pannello Profilo</b>: il riquadro dello stato di salvataggio delle modifiche adesso è sempre visibile`,
  },
  {
    type: 'improvement',
    message: `<b>Pannello Profilo</b>: Migliorata la visualizzazione della preview del profilo`,
  },
  {
    type: 'improvement',
    message: `<b>Changelog</b>: Aggiunto un pulsante per chiudere il modale del changelog`,
  },
  {
    type: 'fix',
    message: `Risolti alcuni problemi di stabilità dell'applicazione`,
  },
  {
    type: 'fix',
    message: `La mappa dell'indirizzo aziendale adesso riporta correttamente all'azienda di appartenenza su Google Maps`,
  },
  {
    type: 'fix',
    message: `<b>Profilo:</b> Risolto un problema che causava una non corretta visualizzazione delle integrazioni se erano 2`,
  },
  {
    type: 'improvement',
    message:
      '<b>Note</b>: è stato migliorato il layout del dettaglio delle note e della lista, per una migliore esperienza utente.',
  },
  {
    type: 'improvement',
    message:
      '<b>Pannello Profilo</b>: da dseskop, la preview del profilo adesso segue lo scroll della pagina',
  },
  {
    type: 'fix',
    message: `Risolto un problema che causava, nelle note, uno sfondo verde non corretto durante la visualizzazione degli editors`,
  },
];

export const agentChangelog: INotifyVersionInfo = {
  tag: 'v0.9.1',
  date: '2024-04-28',
  title: '📓 Migliorie Note-voli',
  description:
    'Le note tornano in Notify con nuove funzionalità e miglioramenti. Ora di nuovo possibile creare, modificare e cancellare note, condividere note con colleghi e molto altro. Scopri tutte le novità di questa versione!',
  artPath:
    'https://s3-api.vps.notifyapp.it/assets/version-art/v0.9.1-agent.webp',
  changes: [
    ..._sharedChanges,
    {
      type: 'improvement',
      message:
        "<b>Note</b>: è ora possibile aggiungere come editor l'account aziendale, oltre a quello dei colleghi",
    },
    {
      type: 'fix',
      message: `Risolti alcuni problemi di visualizzazione del grafico "Integrazioni" nella dashboard`,
    },
    {
      type: 'new',
      message: `Aggiunta una gesture di pull-to-refresh in varie pagine dell'applicazione`,
    },
  ],
};

export const companyChangelog: INotifyVersionInfo = {
  tag: 'v0.8.4',
  date: '2024-04-28',
  title: '📓 Migliorie Note-voli',
  description:
    'Le note tornano in Notify con nuove funzionalità e miglioramenti. Ora di nuovo possibile creare, modificare e cancellare note, condividere note con colleghi e molto altro. Scopri tutte le novità di questa versione!',
  artPath:
    'https://s3-api.vps.notifyapp.it/assets/version-art/v0.8.4-company.webp',
  changes: [
    ..._sharedChanges,
    {
      type: 'new',
      message:
        "<b>Note</b>: è ora possibile gestire le note dall'account aziendale e aggiungere come editor gli utenti dell'azienda",
    },
    {
      type: 'improvement',
      message:
        "<b>Note</b>: è ora possibile aggiungere come editor l'account aziendale, oltre a quello dei colleghi",
    },
    {
      type: 'fix',
      message: `Risolti alcuni problemi di visualizzazione del grafico "Integrazioni" nelle analytics`,
    },
  ],
};
