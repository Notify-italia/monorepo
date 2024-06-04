import { INotifyVersionInfo } from './components/version-label/version-label.component';

const _getVersionArt = (tag: string) => {
  return `https://s3-api.vps.notifyapp.it/assets/version-art/${tag}.webp`;
};

const _sharedDescription = `In questa versione minore non ci sono molti cambiamenti visibili all'utente finale ma qualcosa di grosso e altamente personalizzabile bolle in pentola 👀`;

const _sharedChanges: INotifyVersionInfo['changes'] = [
  {
    type: 'improvement',
    message:
      'Non è passato molto da quando le note sono tornate in <i>Note</i>-ify, da allora abbiamo avuto questo pallino in testa sul fatto che sia un nome fin troppo restrittivo per quello che è il loro potenziale di coworking. <br /> Da questa versione quindi cambiano nome in ✨Progetti✨!',
  },
  {
    type: 'fix',
    message: `Risolto un problema che causava un'immagine di contatto assente su iOS durante la preview di salvataggio nella visualizzazione di un profilo`,
  },
  {
    type: 'fix',
    message: `Risolti alcuni problemi di visualizzazione di un progetto all'interno del profilo`,
  },
  {
    type: 'fix',
    message: `Risolti alcuni problemi minori`,
  },
];

export const agentChangelog: INotifyVersionInfo = {
  tag: 'v1.0.1',
  date: '2024-06-05',
  description: _sharedDescription,
  title: 'Accendendo il fuoco...',
  artPath: _getVersionArt('v1.0.1'),
  changes: [..._sharedChanges],
};

export const companyChangelog: INotifyVersionInfo = {
  tag: 'v1.0.1',
  date: '2024-06-05',
  description: _sharedDescription,
  title: 'Accendendo il fuoco...',
  artPath: _getVersionArt('v1.0.1'),
  changes: [..._sharedChanges],
};
