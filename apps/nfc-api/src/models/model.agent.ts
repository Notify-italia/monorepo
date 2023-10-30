import { ModifyDeep } from '@notify/nfc-app-services';
import { INotifyAgent } from '@notify/nfc-interfaces';
import { ErrorMessage } from 'express-validator/src/base';
import mongoose, {
  Document,
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
} from 'mongoose';
import { Password } from '../services/service.password';
import { ProfileModel } from './model.profile';

/**
 * tipo per facilitare la tipizzazione dei parametri in input delle varie funzioni che hanno bisogno di un oggetto installazione modificabile
 */
export type AgentDocument = Document<unknown, unknown, Agent> &
  Agent &
  Required<{
    _id: mongoose.Types.ObjectId;
  }>;

export const AGENT_VALIDATION_MESSAGES: {
  [key in keyof Partial<Agent>]: ErrorMessage;
} = {
  _id: "L'id del sollecito deve essere un valido id mongoDB",
  email: 'Inserire una email valida',
  password: 'Inserire una password valida',
  enabled: 'Inserire un valore booleano',
  profile: 'Inserire un profilo valido',
};

// 1. Crea un'interfaccia cahe rappresenti il documento in MongoDB
export interface Agent
  extends ModifyDeep<
    INotifyAgent,
    {
      _id: Types.ObjectId;
      createdAt: Date;
      profile: Types.ObjectId;
    }
  > {}

// 2. Crea un'interfaccia che rappresenti i metodi statici del Model
//    nb: serve solo se ci sono metodi statici!
interface AgentModel extends Model<Agent> {
  build(doc: Partial<Agent>): Promise<HydratedDocument<Agent>>;
}

// 3. Crea uno Schema corrispondente all'interfaccia del documento definita al punto 1
//    nb: l'interfaccia del documento avrà anche _id e __v, che non devono essere
//        aggiunte nel Schema!
const OrdineSchema = new Schema<Agent, Agent>(
  {
    email: {
      type: String,
      required: [true, AGENT_VALIDATION_MESSAGES.email as string],
      unique: true,
    },
    password: {
      type: String,
      required: [true, AGENT_VALIDATION_MESSAGES.password as string],
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    profile: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Profile',
    },
  },
  {
    timestamps: true,
  }
);
// Quando ci sono riferimenti ad ID di altri documenti, usa `Schema.Types.ObjectId`

// 4. Aggiungi qui, se ci sono, gli hook da eseguire prima o dopo una operazione di CRUD (create, read, update, delete)
OrdineSchema.pre('save', async function (done) {
  done();
});

// 5. Aggiungi un metodo statico build per creare il nuovo Model
OrdineSchema.statics.build = async (doc: Partial<Agent>) => {
  const agent = new AgentModel(doc);
  agent.password = await Password.toHash(agent.password);

  const profile = await ProfileModel.build({ email: agent.email }).save();

  agent.profile = profile._id;

  return agent;
};

// 6. Esporta il Model creato con la funzione model di mongoose
export const AgentModel = model<Agent, AgentModel>('Agent', OrdineSchema);
