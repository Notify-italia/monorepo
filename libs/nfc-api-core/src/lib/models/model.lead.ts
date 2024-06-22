import { INotifyLead, ModifyDeep } from '@notify/interfaces';
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
export type LeadDocument = Document<unknown, unknown, Lead> &
  Lead &
  Required<{
    _id: mongoose.Types.ObjectId;
  }>;

export const LEAD_VALIDATION_MESSAGES: {
  [key in keyof Partial<Lead>]: string;
} = {
  _id: "L'id del contatto non è valido",
  createdBy: "L'id dell'utente che ha creato il contatto non è valido",
  color: 'Il colore del contatto non è valido',
  name: 'Il nome del contatto non è valido',
  surname: 'Il cognome del contatto non è valido',
  company: "L'azienda del contatto non è valida",
  avatar: "L'avatar del contatto non è valido",
  phoneNumbers: 'I numeri di telefono del contatto non sono validi',
  emails: 'Gli indirizzi email del contatto non sono validi',
  notes: 'Le note del contatto non sono valide',
  origin: "L'origine del contatto non è valida",
  socials: 'I social del contatto non sono validi',
  notifyProfile: "L'id del profilo del contatto non è valido",
  sharedBy: 'I contatti salvati non sono validi',
};

// 1. Crea un'interfaccia cahe rappresenti il documento in MongoDB
export interface Lead
  extends ModifyDeep<
    INotifyLead,
    {
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
      sharedBy: Schema.Types.ObjectId[];
      createdBy: Schema.Types.ObjectId;
      notifyProfile: Schema.Types.ObjectId;
    }
  > {}

// 2. Crea un'interfaccia che rappresenti i metodi statici del Model
//    nb: serve solo se ci sono metodi statici!
interface LeadModel extends Model<Lead> {
  build(doc: Partial<Lead>): HydratedDocument<Lead>;
}

// 3. Crea uno Schema corrispondente all'interfaccia del documento definita al punto 1
//    nb: l'interfaccia del documento avrà anche _id e __v, che non devono essere
//        aggiunte nel Schema!
const LeadSchema = new Schema<Lead, LeadModel>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    color: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    surname: {
      type: String,
      default: null,
    },
    company: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    phoneNumbers: {
      type: [String],
      default: [],
    },
    emails: {
      type: [String],
      default: [],
    },
    notes: {
      type: [
        {
          createdBy: Schema.Types.ObjectId,
          note: String,
        },
      ],
      default: [],
    },
    origin: {
      type: String,
      default: null,
    },
    sharedBy: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    socials: {
      type: [
        {
          type: String,
          url: String,
        },
      ],
      default: [],
    },
    notifyProfile: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: 'Profile',
    },
    accepted: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
// Quando ci sono riferimenti ad ID di altri documenti, usa `Schema.Types.ObjectId`

// 4. Aggiungi qui, se ci sono, gli hook da eseguire prima o dopo una operazione di CRUD (create, read, update, delete)
LeadSchema.pre('save', async function (done) {
  done();
});

// 5. Aggiungi un metodo statico build per creare il nuovo Model
LeadSchema.statics.build = (doc: Partial<Lead>) => {
  return new LeadModel(doc);
};

// 6. Esporta il Model creato con la funzione model di mongoose
export const LeadModel = model<Lead, LeadModel>('Lead', LeadSchema);
