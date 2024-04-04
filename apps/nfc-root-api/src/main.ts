import { connectToDatabase, expressRouter, mLog } from '@notify/nfc-api-core';
import { declareEnvs } from 'libs/nfc-api-core/src/lib/services/service.envs';
import { api } from './routes';

const { BUN_ENV, PORT } = declareEnvs(['BUN_ENV']);

const port = PORT || 3000;

mLog(
  `Starting with Bun version ${Bun.version} with BUN_ENV ${BUN_ENV}`,
  'start'
);

connectToDatabase();

expressRouter(api).listen(port, () => {
  mLog(`listening on port http://localhost:${port}`, 'info');
});
