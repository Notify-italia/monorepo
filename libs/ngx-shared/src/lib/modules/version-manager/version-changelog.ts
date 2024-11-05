import { INotifyVersionInfo } from './components/version-label/version-label.component';

const _getVersionArt = (tag: string) => {
  return `https://s3-api.vps.notifyapp.it/assets/version-art/${tag}.webp`;
};

const _sharedTag = 'v1.2.6';
const _sharedDate = '2024-11-10';
const _sharedTitle = '';
const _sharedDescription = ``;

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
      message: 'Supporto ad iOS 18.1',
    },
    {
      type: 'fix',
      message:
        'Corretto un bug che causava una visualizzazione non corretta del pop up di accoppiamento NFC su dispositivi mobile',
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
