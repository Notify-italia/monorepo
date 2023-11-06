import { Document, FilterQuery, connect } from 'mongoose';
import { wLog } from '../main';

import { Agent, AgentModel } from '../models/model.agent';
import { BadRequestError } from './errors/errors';
import { genericErrorHandler } from './errors/errors/generic-error-handler';
import { declareEnvs } from './service.envs';

export type QueryDbReturnType<T, FindOne> = FindOne extends true
  ? Document<unknown, {}, T> & T
  : (Document<unknown, {}, T> & T)[];

export enum EnumTargetDb {
  Agent = 'agent',
  Company = 'company',
  User = 'user',
}

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

export const queryDb = async <T extends Agent, FindOne extends boolean>(
  targetDb: EnumTargetDb,
  query: FilterQuery<T>,
  findOne = false
): Promise<QueryDbReturnType<T, FindOne>> => {
  const model = _getModel(targetDb);

  if (!model) {
    throw new BadRequestError(`Model ${targetDb} not found`);
  }

  if (!findOne) {
    return (await model.find(query)) as unknown as Promise<
      QueryDbReturnType<T, FindOne>
    >;
  }

  return model.findOne(query) as unknown as Promise<
    QueryDbReturnType<T, FindOne>
  >;
};

const _getModel = (targetDb: EnumTargetDb) => {
  switch (targetDb) {
    case EnumTargetDb.Agent:
      return AgentModel;
    // case EnumTargetDb.Company:
    //   return CompanyModel;
    // case EnumTargetDb.User:
    //   return UserModel;
  }
};
