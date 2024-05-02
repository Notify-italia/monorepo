import { INotifyVersionInfo } from './components/version-label/version-label.component';

const _getVersionArt = (tag: string) => {
  return `https://s3-api.vps.notifyapp.it/assets/version-art/${tag}.webp`;
};

const _sharedChanges: INotifyVersionInfo['changes'] = [
  {
    type: 'improvement',
    message: `Migliorato il componente di ritaglio delle immagini`,
  },
];

export const agentChangelog: INotifyVersionInfo = {
  tag: 'v0.9.2',
  date: '2024-05-01',
  title: '',
  description: '',
  artPath: _getVersionArt('v0.9.2-agent'),
  changes: [
    ..._sharedChanges,
    {
      type: 'improvement',
      message: 'Migliorata la tabella che visualizza i colleghi',
    },
  ],
};

export const companyChangelog: INotifyVersionInfo = {
  tag: 'v0.8.5',
  date: '2024-05-01',
  title: '',
  description: '',
  artPath: _getVersionArt('v0.8.5-company'),
  changes: [
    ..._sharedChanges,
    {
      type: 'improvement',
      message: 'Migliorata la tabella che visualizza gli utenti',
    },
  ],
};
