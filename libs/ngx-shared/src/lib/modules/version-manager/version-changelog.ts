import { INotifyVersionInfo } from './components/version-label/version-label.component';

const _getVersionArt = (tag: string) => {
  return `https://s3-api.vps.notifyapp.it/assets/version-art/${tag}.webp`;
};

const _sharedTag = 'v1.1.0';
const _sharedDate = '2024-07-10';
const _sharedTitle = 'Digitalizzazione 📸';
const _sharedDescription = `Con Notify 1.1.0 è finalmente possibile digitalizzare i noiosi bigliettini da visita cartaceo con un semplice click o tap, ma non è un semplice OCR.. <br/><br/>Grazie alla nostra AI, le informazioni ottenute saranno contestualizzate e organizzate in modo da essere immediatamente utilizzabili. <br/> Dalla pagina di dettaglio potrai inoltre aggiungere commenti, condividerli col tuo team e altro ancora! Tutto questo senza mai abbandonare la tua app preferita 😉`;

const _sharedChanges: INotifyVersionInfo['changes'] = [
  {
    type: 'new',
    message:
      'Contatti: Scansiona i biglietti da visita cartacei tramite AI e gestiscine il contenuto, oltre a poterli esportare in CSV tramite i portali web',
  },
  {
    type: 'improvement',
    message:
      'Migliorata la UI dei modali di conferma per essere più chiari e comprensibili',
  },
  {
    type: 'fix',
    message: `La visualizzazione del profilo è stata ottimizzata per renderla più fluida e reattiva`,
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
