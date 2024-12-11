import { INotifyVersionInfo } from './components/version-label/version-label.component';

const _getVersionArt = (tag: string) => {
  return `https://s3-api.vps.notifyapp.it/assets/version-art/${tag}.webp`;
};

const _sharedTag = 'v1.3.0';
const _sharedDate = '2024-12-15';
const _sharedTitle = 'Sempre con te.';
const _sharedDescription = `A grande richiesta, abbiamo introdotto in Notify la possibilità di inserire un codice QR del tuo profilo sul tuo Wallet. <br /> Vai nella sezione <i>Profilo</i> del tuo account e fai click su Aggiungi ad Apple/Google Wallet. <br /><br /> Inoltre, come di consueto abbiamo risolto alcuni bug minori e migliorato le performance del tuo biglietto da visita digitale preferito <3.`;

const _sharedChanges: INotifyVersionInfo['changes'] = [
  {
    type: 'new',
    message: `Possibilità di inserire un codice QR del tuo profilo sul tuo Wallet su dispositivi Android e iOS`,
  },
  {
    type: 'improvement',
    message: `Reso più chiaro il pulsante di ritorno alla lista contatti dal dettaglio contatto`,
  },
  {
    type: 'improvement',
    message: `La lista notifiche adesso mostra, inizialmente, solo le notifiche non lette`,
  },
  {
    type: 'fix',
    message: 'Risoluzioni di bugs minori e miglioramenti delle performance',
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
  changes: [..._sharedChanges],
};
