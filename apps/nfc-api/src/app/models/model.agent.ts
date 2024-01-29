import { ModifyDeep } from '@notify/api-shared';
import { EnumNotifyUserType, INotifyAgent } from '@notify/interfaces';
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
};

// 1. Crea un'interfaccia cahe rappresenti il documento in MongoDB
export interface Agent
  extends ModifyDeep<
    INotifyAgent,
    {
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
      owner: Types.ObjectId;
    }
  > {}

// 2. Crea un'interfaccia che rappresenti i metodi statici del Model
//    nb: serve solo se ci sono metodi statici!
interface AgentModel extends Model<Agent> {
  build(
    doc: Partial<Agent>,
    company: Types.ObjectId,
    profileData: {
      role: string;
    }
  ): Promise<HydratedDocument<Agent>>;
}

// 3. Crea uno Schema corrispondente all'interfaccia del documento definita al punto 1
//    nb: l'interfaccia del documento avrà anche _id e __v, che non devono essere
//        aggiunte nel Schema!
const AgentSchema = new Schema<Agent, AgentModel>(
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
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Company',
    },
  },
  {
    timestamps: true,
    toObject: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
      virtuals: true,
    },
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
      virtuals: true,
    },
  }
);
// Quando ci sono riferimenti ad ID di altri documenti, usa `Schema.Types.ObjectId`

AgentSchema.virtual('profile', {
  ref: 'Profile',
  localField: '_id',
  foreignField: 'owner',
  justOne: true,
});

// 4. Aggiungi qui, se ci sono, gli hook da eseguire prima o dopo una operazione di CRUD (create, read, update, delete)
AgentSchema.pre('save', async function (done) {
  done();
});

// 5. Aggiungi un metodo statico build per creare il nuovo Model
AgentSchema.statics.build = async (
  doc: Partial<Agent>,
  company: Types.ObjectId,
  profileData: {
    role: string;
  }
) => {
  const agent = new AgentModel(doc);
  agent.password = await Password.toHash(doc.password as string);
  //assigns the company id to the agent
  agent.owner = company;

  //creates a profile for the agent
  await ProfileModel.build({
    email: agent.email,
    type: EnumNotifyUserType.Agent,
    owner: agent._id,
    config: {
      avatarMask: 'circle',
      whatsappEnabled: true,
      phoneCallEnabled: true,
      emailEnabled: true,
      smsEnabled: true,
    },
    ...profileData,
  }).save();

  return agent;
};

// 6. Esporta il Model creato con la funzione model di mongoose
export const AgentModel = model<Agent, AgentModel>('Agent', AgentSchema);
