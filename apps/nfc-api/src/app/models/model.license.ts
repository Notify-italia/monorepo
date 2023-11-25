import { ModifyDeep } from '@notify/api-shared';
import { INotifyLicense } from '@notify/interfaces';
import { ErrorMessage } from 'express-validator/src/base';
import mongoose, {
  Document,
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
} from 'mongoose';

/**
 * tipo per facilitare la tipizzazione dei parametri in input delle varie funzioni che hanno bisogno di un oggetto installazione modificabile
 */
export type LicenseDocument = Document<unknown, unknown, License> &
  License &
  Required<{
    _id: mongoose.Types.ObjectId;
  }>;

export const LICENSE_VALIDATION_MESSAGES: {
  [key in keyof Partial<License>]: ErrorMessage;
} = {
  _id: "L'id della licenza non è valido",
  expirationDate: 'Inserire una data di scadenza valida',
  enabled: 'Inserire un valore valido',
  publicKey: 'Inserire una licenza valida',
};

// 1. Crea un'interfaccia cahe rappresenti il documento in MongoDB
export interface License
  extends ModifyDeep<
    INotifyLicense,
    {
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
    }
  > {}

// 2. Crea un'interfaccia che rappresenti i metodi statici del Model
//    nb: serve solo se ci sono metodi statici!
interface LicenseModel extends Model<License> {
  build(doc: Partial<License>): Promise<HydratedDocument<License>>;
}

// 3. Crea uno Schema corrispondente all'interfaccia del documento definita al punto 1
//    nb: l'interfaccia del documento avrà anche _id e __v, che non devono essere
//        aggiunte nel Schema!
const LicenseSchema = new Schema<License, LicenseModel>(
  {
    expirationDate: {
      type: Date,
      required: [true, LICENSE_VALIDATION_MESSAGES.expirationDate as string],
    },
    enabled: {
      type: Boolean,
      required: [true, LICENSE_VALIDATION_MESSAGES.enabled as string],
    },
    publicKey: {
      type: String,
      required: [true, LICENSE_VALIDATION_MESSAGES.publicKey as string],
    },
    allowedAgents: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);
// Quando ci sono riferimenti ad ID di altri documenti, usa `Schema.Types.ObjectId`

// 4. Aggiungi qui, se ci sono, gli hook da eseguire prima o dopo una operazione di CRUD (create, read, update, delete)
LicenseSchema.pre('save', async function (done) {
  done();
});

// 5. Aggiungi un metodo statico build per creare il nuovo Model
LicenseSchema.statics.build = async (doc: Partial<License>) => {
  return new LicenseModel(doc);
};

// 6. Esporta il Model creato con la funzione model di mongoose
export const LicenseModel = model<License, LicenseModel>(
  'License',
  LicenseSchema
);
