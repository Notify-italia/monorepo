import { connect } from 'mongoose';
import { wLog } from '../../main';
import { genericErrorHandler } from './errors/errors/generic-error-handler';
import { declareEnvs } from './service.envs';

const { MONGO_URI } = declareEnvs(['MONGO_URI']);

export const connectToDatabase = async () => {
  // Tenta di connettersi a MongoDB
  const connection = await connect(MONGO_URI).catch(genericErrorHandler);

  // Altrimenti mostra in console un messaggio di avvenuta connessione
  wLog(
    `MongoDB Connected
  
Available collections:
${(await connection.connection.db.collections())
  .map((i) => i.collectionName)
  .join('\n')}
`,
    'success'
  );
};
