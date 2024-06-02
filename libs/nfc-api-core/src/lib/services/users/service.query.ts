import { EnumNotifyUserType } from '@notify/interfaces';
import { Document, FilterQuery, Model } from 'mongoose';
import { BadRequestError } from '../../errors';
import {
  Agent,
  AgentDocument,
  AgentModel,
  Company,
  CompanyDocument,
  CompanyModel,
} from '../../models';

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
  ? Document<unknown, object, T> & T
  : (Document<unknown, object, T> & T)[];

export const genericUserQuery = async <
  FindOne extends boolean,
  T extends Agent | Company | undefined = undefined
>(
  userType: EnumNotifyUserType,
  query: FilterQuery<T | UserDocType<typeof userType>>,
  findOne = false,
  populate?: string
) => {
  type _ReturnType = Promise<QueryDbReturnType<T, FindOne>>;

  //Obtains the model from the target database
  const model = _getModel(userType);

  if (!model) {
    throw new BadRequestError(`Model ${userType} not found`);
  }

  if (!findOne) {
    //If findOne is false, it will return an array of documents
    return (await model
      .find(query)
      .populate(populate || '')) as unknown as _ReturnType;
  }

  //If findOne is true, it will return a single document
  return model
    .findOne(query)
    .populate(populate || '') as unknown as _ReturnType;
};

const _getModel = (targetDb: string): Model<any> | undefined => {
  switch (targetDb) {
    case EnumNotifyUserType.Agent:
      return AgentModel;
    case EnumNotifyUserType.Company:
      return CompanyModel;
  }
};
