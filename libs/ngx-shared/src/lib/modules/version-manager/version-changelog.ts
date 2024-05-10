import { INotifyVersionInfo } from './components/version-label/version-label.component';

const _getVersionArt = (tag: string) => {
  return `https://s3-api.vps.notifyapp.it/assets/version-art/${tag}.webp`;
};

const _sharedDescription = `Notify entra ufficialmente in produzione! 🚀 <br/> Scarica l'app dagli stores ufficiali Android e iOS tramite i seguenti links
<br/><br/><a class="link link-hover font-medium text-white" href='https://play.google.com/store/apps/details?id=org.notify.agent.client' target='_blank'>Google Play</a> <br/> <a   class="link link-hover font-medium  pointer-events-none text-gray-400" href='https://apps.apple.com/it/app/notify/id1580247021' target='_blank'>App Store</a>
`;

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
    message: `<b>Pannello Profilo</b> è ora possibile modificare l'URL del proprio profilo Notify`,
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
  tag: 'v1.0.0',
  date: '2024-05-10',
  description: _sharedDescription,
  title: 'Release 1.0!',
  artPath: _getVersionArt('v1.0.0'),
  changes: [
    ..._sharedChanges,
    {
      type: 'improvement',
      message: 'Migliorata la tabella che visualizza i colleghi',
    },
    {
      type: 'fix',
      message:
        "Le integrazioni dirette con il dispositivo nell'app sono ora in italiano",
    },
  ],
};

export const companyChangelog: INotifyVersionInfo = {
  tag: 'v1.0.0',
  date: '2024-05-10',
  description: _sharedDescription,
  title: 'Release 1.0!',
  artPath: _getVersionArt('v1.0.0'),
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
