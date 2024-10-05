import { INotifyVersionInfo } from './components/version-label/version-label.component';

const _getVersionArt = (tag: string) => {
  return `https://s3-api.vps.notifyapp.it/assets/version-art/${tag}.webp`;
};

const _sharedTag = 'v1.2.5';
const _sharedDate = '2024-10-31';
const _sharedTitle = '';
const _sharedDescription = ``;

const _sharedChanges: INotifyVersionInfo['changes'] = [
  {
    type: 'new',
    message: 'Nuovi fonts per il tuo profilo Notify',
  },
  {
    type: 'improvement',
    message:
      'Adesso è possibile impostare il proprio avatar a destra o a sinistra nella visualizzazione orizzontale del profilo',
  },
  {
    type: 'fix',
    message:
      'Risoluzione di un bug che impediva il caricamento di alcune immagini nelle note',
  },
  {
    type: 'fix',
    message:
      'Corretto un bug che aggiungeva uno sfondo nero alle immagini con trasparenza inserite come avatar',
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
  tag: '1.2.2', //_sharedTag,
  date: _sharedDate,
  description: _sharedDescription,
  title: _sharedTitle,
  artPath: '', //_getVersionArt(_sharedTag),
  changes: [
    ..._sharedChanges,
    {
      type: 'fix',
      message:
        'Risoluzione di un bug che impediva di visualizzare la tabella degli accounts in alcuni casi',
    },
  ],
};
