import { EnumNotifyUserType } from '@notify/nfc-interfaces';
import { Document, FilterQuery, Model } from 'mongoose';
import { AgentDocument, AgentModel } from '../../models/model.agent';
import { CompanyDocument, CompanyModel } from '../../models/model.company';
import { BadRequestError } from '../errors/errors';

/**
 * The `AccountTypes` type is a union of the `AgentDocument` and `CompanyDocument` types.
 */
export type UserDocTypes = AgentDocument | CompanyDocument;

/**
 * The `AccountType` type is a conditional type that takes a generic type `T` and returns one type from the `AccountTypes` union
 */
export type UserDocType<T> = T extends EnumNotifyUserType.Agent
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

export const genericUserQuery = async <
  FindOne extends boolean,
  T extends UserDocTypes | undefined = undefined
>(
  targetDb: string,
  query: FilterQuery<T | UserDocType<typeof targetDb>>,
  findOne = false
) => {
  type _ReturnType = Promise<
    QueryDbReturnType<T | UserDocType<typeof targetDb>, FindOne>
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

const _getModel = (targetDb: string): Model<any> | undefined => {
  switch (targetDb) {
    case EnumNotifyUserType.Agent:
      return AgentModel;
    case EnumNotifyUserType.Company:
      return CompanyModel;
  }
};
