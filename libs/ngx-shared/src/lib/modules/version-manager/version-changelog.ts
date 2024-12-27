import { INotifyVersionInfo } from './components/version-label/version-label.component';

const _getVersionArt = (tag: string) => {
  return `https://s3-api.vps.notifyapp.it/assets/version-art/${tag}.webp`;
};

const _sharedTag = 'v1.4';
const _sharedDate = '2024-12-15';
const _sharedTitle = 'Stabilità e performance (3)';
const _sharedDescription = `Piccole ma importanti correzioni e miglioramenti per garantire che il tuo biglietto da visita digitale sia sempre al top!`;

const _sharedChanges: INotifyVersionInfo['changes'] = [
  {
    type: 'improvement',
    message: 'Aggiunta la possibilità di inserire un link ad x.com nel profilo',
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
