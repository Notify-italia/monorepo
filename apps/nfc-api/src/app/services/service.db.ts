import { Document, FilterQuery, Model, connect } from 'mongoose';
import { wLog } from '../../main';

import { AgentDocument, AgentModel } from '../models/model.agent';
import { CompanyDocument, CompanyModel } from '../models/model.company';
import { BadRequestError } from './errors/errors';
import { genericErrorHandler } from './errors/errors/generic-error-handler';
import { declareEnvs } from './service.envs';

/**
 * The `AccountTypes` type is a union of the `AgentDocument` and `CompanyDocument` types.
 */
export type AccountTypes = AgentDocument | CompanyDocument;

/**
 * The `AccountType` type is a conditional type that takes a generic type `T` and returns one type from the `AccountTypes` union
 */
export type AccountType<T> = T extends EnumTargetDb.Agent
  ? AgentDocument
  : CompanyDocument;

/**
 * The `QueryDbReturnType` type is a conditional type that takes a generic type `T` and a boolean `FindOne` and returns a type
 * based on the `FindOne` parameter. If `FindOne` is true, it will return a single document. If `FindOne` is false, it will return
 * an array of documents.
 * @param {T} - The `T` parameter is a generic type that represents the type of the document(s) that will be returned.
 * @param {FindOne} - The `FindOne` parameter is a boolean that indicates whether the query will return a single document or an array of documents.
 * @returns a type based on the `FindOne` parameter. If `FindOne` is true, it will return a single document. If `FindOne` is false, it will return
 * an array of documents.
 */
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

export const genericQuery = async <
  FindOne extends boolean,
  T extends AccountTypes | undefined = undefined
>(
  targetDb: EnumTargetDb,
  query: FilterQuery<T | AccountType<typeof targetDb>>,
  findOne = false
) => {
  type _ReturnType = Promise<
    QueryDbReturnType<T | AccountType<typeof targetDb>, FindOne>
  >;

  //Obtains the model from the target database
  const model = _getModel(targetDb);

  if (!model) {
    throw new BadRequestError(`Model ${targetDb} not found`);
  }

  if (!findOne) {
    //If findOne is false, it will return an array of documents
    return (await model.find(query)) as unknown as _ReturnType;
  }

  //If findOne is true, it will return a single document
  return model.findOne(query) as unknown as _ReturnType;
};

const _getModel = (targetDb: EnumTargetDb): Model<any> | undefined => {
  switch (targetDb) {
    case EnumTargetDb.Agent:
      return AgentModel;
    case EnumTargetDb.Company:
      return CompanyModel;
    // case EnumTargetDb.User:
    //   return UserModel;
  }
};
