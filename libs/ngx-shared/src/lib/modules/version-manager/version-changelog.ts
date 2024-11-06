import { INotifyVersionInfo } from './components/version-label/version-label.component';

const _getVersionArt = (tag: string) => {
  return `https://s3-api.vps.notifyapp.it/assets/version-art/${tag}.webp`;
};

const _sharedTag = 'v1.2.6';
const _sharedDate = '2024-11-10';
const _sharedTitle = '';
const _sharedDescription = `Un altro aggiornamento per migliorare la tua esperienza con Notify!`;

const _sharedChanges: INotifyVersionInfo['changes'] = [
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
  changes: [
    ..._sharedChanges,
    {
      type: 'fix',
      message:
        'Risolto un bug che causava un colore indesiderato dei widget nella dashbaord su iPhones aggiornati ad iOS 18 e su Safari 18',
    },
    {
      type: 'fix',
      message:
        'Risolto un bug che causava disconnessioni inaspettate su iPhones aggiornati ad iOS 18 e su Safari 18',
    },
    {
      type: 'fix',
      message:
        'Corretto un bug che causava una visualizzazione non corretta del pop-up di accoppiamento NFC',
    },
  ],
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
      type: 'fix',
      message:
        'Corretto un bug che impediva di visualizzare la tabella degli accounts in alcuni casi',
    },
  ],
};
