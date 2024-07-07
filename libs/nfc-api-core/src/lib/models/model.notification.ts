import { INotifyNotification, ModifyDeep } from '@notify/interfaces';
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
export type NotificationDocument = Document<unknown, unknown, Notification> &
  Notification &
  Required<{
    _id: mongoose.Types.ObjectId;
  }>;

export const NOTIFICATION_VALIDATION_MESSAGES: {
  [key in keyof Partial<Notification>]: string;
} = {
  _id: 'Notifica non valida',
  owner: 'Il proprietario della notifica è obbligatorio',
};

// 1. Crea un'interfaccia cahe rappresenti il documento in MongoDB
export interface Notification
  extends ModifyDeep<
    INotifyNotification,
    {
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
      owner: Types.ObjectId;
      notificationType: string;
    }
  > {}

// 2. Crea un'interfaccia che rappresenti i metodi statici del Model
//    nb: serve solo se ci sono metodi statici!
interface NotificationModel extends Model<Notification> {
  build(doc: Partial<Notification>): HydratedDocument<Notification>;
}

// 3. Crea uno Schema corrispondente all'interfaccia del documento definita al punto 1
//    nb: l'interfaccia del documento avrà anche _id e __v, che non devono essere
//        aggiunte nel Schema!
const NotificationSchema = new Schema<Notification, NotificationModel>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    read: {
      type: Boolean,
      default: false,
    },
    selectedAction: {
      type: String,
      default: null,
    },
    notificationType: {
      type: String,
      default: 'info',
    },
    actions: {
      type: [
        {
          id: {
            type: String,
            default: '',
          },
          title: {
            type: String,
            required: true,
          },
          eventName: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
// Quando ci sono riferimenti ad ID di altri documenti, usa `Schema.Types.ObjectId`

// 4. Aggiungi qui, se ci sono, gli hook da eseguire prima o dopo una operazione di CRUD (create, read, update, delete)
NotificationSchema.pre('save', async function (done) {
  done();
});

// 5. Aggiungi un metodo statico build per creare il nuovo Model
NotificationSchema.statics.build = (doc: Partial<Notification>) => {
  return new NotificationModel(doc);
};

// 6. Esporta il Model creato con la funzione model di mongoose
export const NotificationModel = model<Notification, NotificationModel>(
  'Notification',
  NotificationSchema
);
