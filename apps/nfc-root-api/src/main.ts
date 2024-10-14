import { connectToDatabase, expressRouter, mLog } from '@notify/nfc-api-core';
import { declareEnvs } from 'libs/nfc-api-core/src/lib/services/service.envs';
import Stripe from 'stripe';
import { api } from './routes';

const { BUN_ENV, PORT, STRIPE_SECRET_KEY } = declareEnvs([
  'BUN_ENV',
  'STRIPE_SECRET_KEY',
]);

const port = PORT || 3000;

export const stripe = new Stripe(STRIPE_SECRET_KEY);

mLog(
  `Starting with Bun version ${Bun.version} with BUN_ENV ${BUN_ENV}`,
  'start'
);

connectToDatabase();

expressRouter(api).listen(port, () => {
  mLog(`listening on port http://localhost:${port}`, 'info');
});
