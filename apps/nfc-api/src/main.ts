import {
  connectToDatabase,
  expressRouter,
  initSocketio,
  mLog,
} from '@notify/nfc-api-core';
import * as Sentry from '@sentry/bun';
import { declareEnvs } from 'libs/nfc-api-core/src/lib/services/service.envs';
import { api } from './app/routes';
import { socketEvents } from './app/socketio';

const { SENTRY_DSN, BUN_ENV, PORT } = declareEnvs(['SENTRY_DSN', 'BUN_ENV']);

const port = PORT || 3000;

const server = expressRouter(api);

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0, // Capture 100% of the transactions
});

mLog(
  `Starting with Bun version ${Bun.version} with BUN_ENV ${BUN_ENV}`,
  'start'
);

connectToDatabase();

server.listen(port, () => {
  mLog(`listening on port http://localhost:${port}`, 'info');
});

initSocketio(server, socketEvents).listen(() =>
  mLog(`Listening socket.io on port ${port}`, 'info')
);

// await createNotification({
//   title: 'Stefano ha salvato il tuo profilo tra i suoi contatti',
//   subtitle: `This an <b>INFO</b> notification`,
//   notificationType: EnumNotificationType.Info,
//   owner: new Types.ObjectId('657b7d4aed97ebff602f8ee9'),
// });

// await createNotification({
//   title: 'La tua licenza sta per scadere',
//   subtitle: `This an <b>Warning</b> notification`,
//   notificationType: EnumNotificationType.Warning,
//   actions: [
//     {
//       id: '1',
//       title: 'Rinnova ora',
//       data: {
//         lead: '123',
//       },
//       eventName: EnumNotifyNotificationActionEvents.ContactFormLeadAccept,
//     },
//   ],
//   owner: new Types.ObjectId('657b7d4aed97ebff602f8ee9'),
// });

// await createNotification({
//   title: 'Qualcuno ha compilato il form di contatto',
//   subtitle: `This an <b>Action Required</b> notification`,
//   notificationType: EnumNotificationType.ActionRequired,
//   actions: [
//     {
//       id: '1',
//       title: 'Accept',
//       data: {
//         lead: '123',
//       },
//       eventName: EnumNotifyNotificationActionEvents.ContactFormLeadAccept,
//     },
//     {
//       id: '2',
//       title: 'Refuse',
//       data: {
//         lead: '123',
//       },
//       eventName: EnumNotifyNotificationActionEvents.ContactFormLeadReject,
//     },
//   ],
//   owner: new Types.ObjectId('657b7d4aed97ebff602f8ee9'),
// });

// await createNotification({
//   title: 'Tentativo di Log-in fallito',
//   subtitle: `This an <b>Error</b> notification`,
//   notificationType: EnumNotificationType.Error,
//   actions: [
//     {
//       id: '1',
//       title: 'Modifica la password',
//       data: {
//         lead: '123',
//       },
//       eventName: EnumNotifyNotificationActionEvents.ContactFormLeadAccept,
//     },
//     {
//       id: '2',
//       title: 'Ignora',
//       data: {
//         lead: '123',
//       },
//       eventName: EnumNotifyNotificationActionEvents.ContactFormLeadReject,
//     },
//   ],
//   owner: new Types.ObjectId('657b7d4aed97ebff602f8ee9'),
// });
