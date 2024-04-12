import { ModifyDeep } from '@notify/api-shared';
import { INotifyFeedback } from '@notify/interfaces';
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
export type FeedbackDocument = Document<unknown, unknown, Feedback> &
  Feedback &
  Required<{
    _id: mongoose.Types.ObjectId;
  }>;

export const FEEDBACK_VALIDATION_MESSAGES: {
  [key in keyof Partial<Feedback>]: string;
} = {
  _id: "L'id della licenza non è valido",
  owner: 'Utente non valido',
  rating: 'Il rating è obbligatorio',
  comment: 'Il commento è obbligatorio',
};

// 1. Crea un'interfaccia cahe rappresenti il documento in MongoDB
export interface Feedback
  extends ModifyDeep<
    INotifyFeedback,
    {
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
      owner: Schema.Types.ObjectId;
    }
  > {}

// 2. Crea un'interfaccia che rappresenti i metodi statici del Model
//    nb: serve solo se ci sono metodi statici!
interface FeedbackModel extends Model<Feedback> {
  build(doc: Partial<Feedback>): HydratedDocument<Feedback>;
}

// 3. Crea uno Schema corrispondente all'interfaccia del documento definita al punto 1
//    nb: l'interfaccia del documento avrà anche _id e __v, che non devono essere
//        aggiunte nel Schema!
const FeedbackSchema = new Schema<Feedback, FeedbackModel>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: [true, FEEDBACK_VALIDATION_MESSAGES.owner],
    },
    rating: {
      type: Number,
      required: [true, FEEDBACK_VALIDATION_MESSAGES.rating as string],
    },
    comment: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
// Quando ci sono riferimenti ad ID di altri documenti, usa `Schema.Types.ObjectId`

// 4. Aggiungi qui, se ci sono, gli hook da eseguire prima o dopo una operazione di CRUD (create, read, update, delete)
FeedbackSchema.pre('save', async function (done) {
  done();
});

// 5. Aggiungi un metodo statico build per creare il nuovo Model
FeedbackSchema.statics.build = (doc: Partial<Feedback>) => {
  return new FeedbackModel(doc);
};

// 6. Esporta il Model creato con la funzione model di mongoose
export const FeedbackModel = model<Feedback, FeedbackModel>(
  'Feedback',
  FeedbackSchema
);
