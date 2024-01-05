import { ModifyDeep } from '@notify/api-shared';
import { INotifyNote } from '@notify/interfaces';
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
export type NoteDocument = Document<unknown, unknown, Note> &
  Note &
  Required<{
    _id: mongoose.Types.ObjectId;
  }>;

export const NOTE_VALIDATION_MESSAGES: {
  [key in keyof Partial<Note>]: ErrorMessage;
} = {
  _id: "L'id della licenza non è valido",
  owner: 'Utente non valido',
  title: 'Titolo non valido',
  content: 'Contenuto non valido',
};

// 1. Crea un'interfaccia cahe rappresenti il documento in MongoDB
export interface Note
  extends ModifyDeep<
    INotifyNote,
    {
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
      owner: Schema.Types.ObjectId;
    }
  > {}

// 2. Crea un'interfaccia che rappresenti i metodi statici del Model
//    nb: serve solo se ci sono metodi statici!
interface NoteModel extends Model<Note> {
  build(doc: Partial<Note>): Promise<HydratedDocument<Note>>;
}

// 3. Crea uno Schema corrispondente all'interfaccia del documento definita al punto 1
//    nb: l'interfaccia del documento avrà anche _id e __v, che non devono essere
//        aggiunte nel Schema!
const NoteSchema = new Schema<Note, NoteModel>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: [true, NOTE_VALIDATION_MESSAGES.owner],
    },
  },
  {
    timestamps: true,
  }
);
// Quando ci sono riferimenti ad ID di altri documenti, usa `Schema.Types.ObjectId`

// 4. Aggiungi qui, se ci sono, gli hook da eseguire prima o dopo una operazione di CRUD (create, read, update, delete)
NoteSchema.pre('save', async function (done) {
  done();
});

// 5. Aggiungi un metodo statico build per creare il nuovo Model
NoteSchema.statics.build = async (doc: Partial<Note>) => {
  return new NoteModel(doc);
};

// 6. Esporta il Model creato con la funzione model di mongoose
export const NoteModel = model<Note, NoteModel>('Note', NoteSchema);
