import { ModifyDeep } from '@notify/nfc-app-services';
import { INotifyProfile } from '@notify/nfc-interfaces';
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
export type ProfileDocument = Document<unknown, unknown, Profile> &
  Profile &
  Required<{
    _id: mongoose.Types.ObjectId;
  }>;

export const PROFILE_VALIDATION_MESSAGES: {
  [key in keyof Partial<Profile>]: string | { [key: string]: string };
} = {
  _id: "L'id del profilo deve essere un valido id mongoDB",
  name: 'Inserire un nome valido',
  surname: 'Inserire un cognome valido',
  email: 'Inserire una email valida',
  phoneNumber: 'Inserire un numero di telefono valido',
  bio: 'Inserire una bio valida',
  avatar: 'Inserire un avatar valido',
  config: {
    whatsappEnabled: 'Inserire un valore booleano',
    phoneCallEnabled: 'Inserire un valore booleano',
    emailEnabled: 'Inserire un valore booleano',
  },
  customFields: {
    iconName: 'Inserire un nome di icona valido',
    value: 'Inserire un valore valido',
  },
};

// 1. Crea un'interfaccia cahe rappresenti il documento in MongoDB
export interface Profile
  extends ModifyDeep<
    INotifyProfile,
    {
      _id: Types.ObjectId;
      createdAt: Date;
    }
  > {}

// 2. Crea un'interfaccia che rappresenti i metodi statici del Model
//    nb: serve solo se ci sono metodi statici!
interface ProfileModel extends Model<Profile> {
  build(doc: Partial<Profile>): HydratedDocument<Profile>;
}

// 3. Crea uno Schema corrispondente all'interfaccia del documento definita al punto 1
//    nb: l'interfaccia del documento avrà anche _id e __v, che non devono essere
//        aggiunte nel Schema!
const OrdineSchema = new Schema<Profile, Profile>(
  {
    name: {
      type: String,
      required: [true, PROFILE_VALIDATION_MESSAGES.name as string],
    },
    surname: {
      type: String,
      required: [true, PROFILE_VALIDATION_MESSAGES.surname as string],
    },
    email: {
      type: String,
      required: [true, PROFILE_VALIDATION_MESSAGES.email as string],
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: [true, PROFILE_VALIDATION_MESSAGES.phoneNumber as string],
    },
    bio: {
      type: String,
      required: [true, PROFILE_VALIDATION_MESSAGES.bio as string],
    },
    avatar: {
      type: String,
      required: [true, PROFILE_VALIDATION_MESSAGES.avatar as string],
    },
    config: {
      whatsappEnabled: {
        type: Boolean,
        required: [
          true,
          (PROFILE_VALIDATION_MESSAGES.config as { [key: string]: string })
            .whatsappEnabled,
        ],
      },
      phoneCallEnabled: {
        type: Boolean,
        required: [
          true,
          (PROFILE_VALIDATION_MESSAGES.config as { [key: string]: string })
            .phoneCallEnabled,
        ],
      },
      emailEnabled: {
        type: Boolean,
        required: [
          true,
          (PROFILE_VALIDATION_MESSAGES.config as { [key: string]: string })
            .emailEnabled,
        ],
      },
    },
    customFields: {
      type: [
        {
          iconName: {
            type: String,
            required: [
              true,
              (
                PROFILE_VALIDATION_MESSAGES.customFields as {
                  [key: string]: string;
                }
              ).iconName,
            ],
          },
          value: {
            type: String,
            required: [
              true,
              (
                PROFILE_VALIDATION_MESSAGES.customFields as {
                  [key: string]: string;
                }
              ).value,
            ],
          },
          company: {
            type: Schema.Types.ObjectId || undefined,
            required: false,
            ref: 'Profile',
          },
        },
      ],
      required: true,
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
OrdineSchema.statics.build = async (doc: Partial<Profile>) => {
  const Profile = new ProfileModel(doc);

  return Profile;
};

// 6. Esporta il Model creato con la funzione model di mongoose
export const ProfileModel = model<Profile, ProfileModel>(
  'Profile',
  OrdineSchema
);
