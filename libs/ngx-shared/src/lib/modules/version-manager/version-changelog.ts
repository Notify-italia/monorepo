import { INotifyVersionInfo } from './components/version-label/version-label.component';

const _getVersionArt = (tag: string) => {
  return `https://s3-api.vps.notifyapp.it/assets/version-art/${tag}.webp`;
};

const _sharedChanges: INotifyVersionInfo['changes'] = [
  {
    type: 'improvement',
    message: `Migliorata la gestione del ritaglio delle immagini durante il caricamento`,
  },
  {
    type: 'improvement',
    message: `La Sidebar su desktop è ora più compatta e mostra solo le icone dei menu`,
  },
  {
    type: 'improvement',
    message: `Nella la selezione di un colore è ora possibile selezionare un colore personalizzato`,
  },
  {
    type: 'new',
    message: `<b>Pannello Profilo</b> è ora possibile modificare l'url del proprio profilo Notify`,
  },
  {
    type: 'fix',
    message:
      '<b>Profilo</b>: Risolto un problema che impediva la corretta assegnazione del testo di alcuni elementi',
  },
  {
    type: 'fix',
    message:
      'Risolti alcuni problemi minori e migliorata la stabilità generale del sistema',
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
      message:
        '<b>Gestione Utenti</b>: Migliorata la tabella che visualizza gli utenti',
    },
    {
      type: 'fix',
      message:
        'Risolto un problema che impediva la visualizzazione del grafico visite dopo il cambio di utente selezionato',
    },
    {
      type: 'improvement',
      message:
        '<b>Pannello Profilo</b>: è ora possibile ottenere automaticamente il link per la recensione su Google',
    },
  ],
};
