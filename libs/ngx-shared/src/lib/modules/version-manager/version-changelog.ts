import { INotifyVersionInfo } from './components/version-label/version-label.component';

const _getVersionArt = (tag: string) => {
  return `https://s3-api.vps.notifyapp.it/assets/version-art/${tag}.webp`;
};

const _sharedDescription = `Un'altra versione di Notify, un'altra occasione per migliorare l'esperienza utente e risolvere alcuni problemi minori. Intanto continiuamo a "cucinare" in segreto 🫢`;

const _sharedChanges: INotifyVersionInfo['changes'] = [
  {
    type: 'improvement',
    message:
      "Haptic feedback aggiunto nei toggle per migliorare l'esperienza utente",
  },
  {
    type: 'improvement',
    message:
      'Aggiunte alcune nuove integrazioni nel pannello di personalizzazione del profilo',
  },
  {
    type: 'fix',
    message: `Risolto un problema che causava la visualizzazione non corretta dello stato di hover degli elementi clickabili da mobile`,
  },
  {
    type: 'fix',
    message: `Risolti alcuni problemi minori`,
  },
];

export const agentChangelog: INotifyVersionInfo = {
  tag: 'v1.0.2',
  date: '2024-06-18',
  description: _sharedDescription,
  title: 'Mettendo la carne...',
  artPath: _getVersionArt('v1.0.2'),
  changes: [..._sharedChanges],
};

export const companyChangelog: INotifyVersionInfo = {
  tag: 'v1.0.2',
  date: '2024-06-18',
  description: _sharedDescription,
  title: 'Mettendo la carne...',
  artPath: _getVersionArt('v1.0.2'),
  changes: [..._sharedChanges],
};
