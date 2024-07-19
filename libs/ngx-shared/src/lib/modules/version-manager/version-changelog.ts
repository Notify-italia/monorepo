import { INotifyVersionInfo } from './components/version-label/version-label.component';

const _getVersionArt = (tag: string) => {
  return `https://s3-api.vps.notifyapp.it/assets/version-art/${tag}.webp`;
};

const _sharedTag = 'v1.2.0';
const _sharedDate = '2024-07-22';
const _sharedTitle = 'Notifiche 🔔';
const _sharedDescription = `Le Notifiche arrivano finalmente su Notify! Ricevi notifiche in tempo reale per le attività più importanti e non perdere mai un'opportunità!`;

const _sharedChanges: INotifyVersionInfo['changes'] = [
  {
    type: 'new',
    message:
      "Tramite il pulsante 'Notifiche' nella navbar o nella top bar da mobile, è ora possibile visualizzare e gestire notifiche relative ad alcune attività all'interno dell'app. Inizialmente le notifiche sono disponibili per le attività di acquisizione contatti e commenti sugli stessi ma verranno estese in futuro",
  },
  {
    type: 'fix',
    message: `Migliorata la gestione degli spazi nella sidebar su PC per evitare di dover fare scrolling per visualizzare tutte le pagine navigabili su schermi di piccole dimensioni`,
  },
  {
    type: 'fix',
    message: `Risolto un bug che causava la visualizzazione errata del modale di ritaglio immagine`,
  },
  {
    type: 'fix',
    message: `Risolto un bug che impediva il corretto passaggio tra profilo e reindirizzamento ad un URL`,
  },
  {
    type: 'improvement',
    message: `Unificate le animazioni di apertura e chiusura dei modali`,
  },
  {
    type: 'improvement',
    message: `Aggiunto feedback haptico alla pressione dei pulsanti su dispositivi iOS e Android compatibili`,
  },
  {
    type: 'improvement',
    message: `Migliorato il cropper di immagini, ora è possibile ruotare e specchiare un'immagine, oltre ad offrire una migliore esperienza d'uso su dispositivi mobile`,
  },
  {
    type: 'fix',
    message: `Risolti alcuni problemi minori`,
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
      message: `La licenza adesso viene visualizzata nelle impostazioni dell'account e non più in una pagina separata`,
    },
  ],
};
