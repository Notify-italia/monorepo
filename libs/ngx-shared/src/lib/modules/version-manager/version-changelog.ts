import { INotifyVersionInfo } from './components/version-label/version-label.component';

const _getVersionArt = (tag: string) => {
  return `https://s3-api.vps.notifyapp.it/assets/version-art/${tag}.webp`;
};

const _sharedTag = 'v1.2.0';
const _sharedDate = '2024-07-30';
const _sharedTitle = 'Notifiche Push 🔔';
const _sharedDescription = `Con Notify 1.1.0 è finalmente possibile digitalizzare i noiosi bigliettini da visita cartaceo con un semplice click o tap, ma non è un semplice OCR.. <br/><br/>Grazie alla nostra AI, le informazioni ottenute saranno contestualizzate e organizzate in modo da essere immediatamente utilizzabili. <br/> Dalla pagina di dettaglio potrai inoltre aggiungere commenti, condividerli col tuo team e altro ancora! Tutto questo senza mai abbandonare la tua app preferita 😉`;

const _sharedChanges: INotifyVersionInfo['changes'] = [
  {
    type: 'new',
    message:
      "Le Notifiche Push arrivano finalmente su Notify! Ricevi notifiche in tempo reale sull'acquisizione di nuovi contatti, commenti e molto altro!",
  },
  {
    type: 'fix',
    message: `Migliorata la gestione degli spazi nella sidebar su PC per evitare di dover fare scrolling per visualizzare tutte le pagine navigabili su schermi di piccole dimensioni`,
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
  changes: [
    ..._sharedChanges,
    {
      type: 'improvement',
      message:
        'La tab "Colleghi" viene nascosta automaticamente in caso di assenza di colleghi',
    },
  ],
};

export const companyChangelog: INotifyVersionInfo = {
  tag: _sharedTag,
  date: _sharedDate,
  description: _sharedDescription,
  title: _sharedTitle,
  artPath: _getVersionArt(_sharedTag),
  changes: [..._sharedChanges],
};
