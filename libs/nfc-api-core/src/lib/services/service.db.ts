import { connect } from 'mongoose';
import { genericErrorHandler } from '../errors/generic-error-handler';
import { wLog } from '../services';
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
