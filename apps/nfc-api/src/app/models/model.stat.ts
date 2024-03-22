import { ModifyDeep } from '@notify/api-shared';
import { INotifyStat } from '@notify/interfaces';
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
export type StatDocument = Document<unknown, unknown, Stat> &
  Stat &
  Required<{
    _id: mongoose.Types.ObjectId;
  }>;

export const STAT_VALIDATION_MESSAGES: {
  [key in keyof Partial<Stat>]: ErrorMessage;
} = {
  _id: 'ID non valido',
  type: 'Tipo statistica non valido',
  owner: 'ID proprietario non valido',
  period: 'Periodo non valido',
};

// 1. Crea un'interfaccia cahe rappresenti il documento in MongoDB
export interface Stat
  extends ModifyDeep<
    INotifyStat,
    {
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
      owner: Schema.Types.ObjectId;
    }
  > {}

// 2. Crea un'interfaccia che rappresenti i metodi statici del Model
//    nb: serve solo se ci sono metodi statici!
interface StatModel extends Model<Stat> {
  build(doc: Partial<Stat>): Promise<HydratedDocument<Stat>>;
}

// 3. Crea uno Schema corrispondente all'interfaccia del documento definita al punto 1
//    nb: l'interfaccia del documento avrà anche _id e __v, che non devono essere
//        aggiunte nel Schema!
const StatSchema = new Schema<Stat, StatModel>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: [true, STAT_VALIDATION_MESSAGES.owner],
    },
    value: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    period: {
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
        required: true,
      },
    },
  },
  {
    timestamps: true,
    toObject: {
      transform(doc, ret) {
        delete ret.__v;
      },
      virtuals: true,
    },
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
      virtuals: true,
    },
  }
);

// 4. Aggiungi qui, se ci sono, gli hook da eseguire prima o dopo una operazione di CRUD (create, read, update, delete)
StatSchema.pre('save', async function (done) {
  done();
});

// 5. Aggiungi un metodo statico build per creare il nuovo Model
StatSchema.statics.build = async (doc: Partial<Stat>) => {
  return new StatModel(doc);
};

// 6. Esporta il Model creato con la funzione model di mongoose
export const StatModel = model<Stat, StatModel>('Stat', StatSchema);
