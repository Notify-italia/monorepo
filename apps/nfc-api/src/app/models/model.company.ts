import { ModifyDeep } from '@notify/api-shared';
import { EnumNotifyUserType, INotifyCompany } from '@notify/interfaces';
import { ErrorMessage } from 'express-validator/src/base';
import mongoose, {
  Document,
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
} from 'mongoose';
import { Password } from '../services/users/service.password';
import { ProfileModel } from './model.profile';

/**
 * tipo per facilitare la tipizzazione dei parametri in input delle varie funzioni che hanno bisogno di un oggetto installazione modificabile
 */
export type CompanyDocument = Document<unknown, unknown, Company> &
  Company &
  Required<{
    _id: mongoose.Types.ObjectId;
  }>;

export const COMPANY_VALIDATION_MESSAGES: {
  [key in keyof Partial<Company>]: ErrorMessage;
} = {
  _id: "L'id del sollecito deve essere un valido id mongoDB",
  email: 'Inserire una email valida',
  password: 'Inserire una password valida',
  profile: 'Inserire un profilo valido',
};

// 1. Crea un'interfaccia cahe rappresenti il documento in MongoDB
export interface Company
  extends ModifyDeep<
    INotifyCompany,
    {
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
      profile: Types.ObjectId;
      license: Types.ObjectId;
    }
  > {}

// 2. Crea un'interfaccia che rappresenti i metodi statici del Model
//    nb: serve solo se ci sono metodi statici!
interface CompanyModel extends Model<Company> {
  build(doc: Partial<Company>): Promise<HydratedDocument<Company>>;
}

// 3. Crea uno Schema corrispondente all'interfaccia del documento definita al punto 1
//    nb: l'interfaccia del documento avrà anche _id e __v, che non devono essere
//        aggiunte nel Schema!
const CompanySchema = new Schema<Company, CompanyModel>(
  {
    email: {
      type: String,
      required: [true, COMPANY_VALIDATION_MESSAGES.email as string],
      unique: true,
    },
    password: {
      type: String,
      required: [true, COMPANY_VALIDATION_MESSAGES.password as string],
    },
    profile: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Profile',
    },
    license: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'License',
    },
  },
  {
    timestamps: true,
    toObject: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);
// Quando ci sono riferimenti ad ID di altri documenti, usa `Schema.Types.ObjectId`

// 4. Aggiungi qui, se ci sono, gli hook da eseguire prima o dopo una operazione di CRUD (create, read, update, delete)
CompanySchema.pre('save', async function (done) {
  done();
});

// 5. Aggiungi un metodo statico build per creare il nuovo Model
CompanySchema.statics.build = async (doc: Partial<Company>) => {
  const company = new CompanyModel(doc);
  company.password = await Password.toHash(company.password);

  //creates a profile for the company
  await ProfileModel.build({
    email: company.email,
    type: EnumNotifyUserType.Company,
    owner: company._id,
  }).save();

  return company;
};

// 6. Esporta il Model creato con la funzione model di mongoose
export const CompanyModel = model<Company, CompanyModel>(
  'Company',
  CompanySchema
);
