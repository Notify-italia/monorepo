import { ModifyDeep } from '@notify/api-shared';
import {
  EnumNotifyAPBackgroundTypes,
  EnumNotifyAPDirections,
  EnumNotifyUserType,
  INotifyProfile,
} from '@notify/interfaces';
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
  [key in keyof Partial<INotifyProfile>]: string | { [key: string]: string };
} = {
  _id: "L'id del profilo non è valido",
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
  profileIdentifier: 'Inserire un identificatore valido',
};

// 1. Crea un'interfaccia cahe rappresenti il documento in MongoDB
export interface Profile
  extends ModifyDeep<
    INotifyProfile,
    {
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
      owner: Types.ObjectId;
    }
  > {}

// 2. Crea un'interfaccia che rappresenti i metodi statici del Model
//    nb: serve solo se ci sono metodi statici!
interface ProfileModel extends Model<Profile> {
  build(doc: Partial<Profile>): HydratedDocument<Profile>;
}

const _itemSchema = new Schema(
  {
    type: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '',
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
    strict: false,
  }
);

// 3. Crea uno Schema corrispondente all'interfaccia del documento definita al punto 1
//    nb: l'interfaccia del documento avrà anche _id e __v, che non devono essere
//        aggiunte nel Schema!
const ProfileSchema = new Schema<Profile, ProfileModel>(
  {
    name: {
      type: String,
      default: null,
    },
    surname: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: null,
    },
    config: {
      whatsappEnabled: {
        type: Boolean,
        default: true,
      },
      phoneCallEnabled: {
        type: Boolean,
        default: true,
      },
      emailEnabled: {
        type: Boolean,
        default: true,
      },
      avatarMask: {
        type: String,
        default: null,
      },
      smsEnabled: {
        type: Boolean,
        default: true,
      },
      redirectEnabled: {
        type: Boolean,
        default: true,
      },
      feedbackEnabled: {
        type: Boolean,
        default: true,
      },
    },
    type: {
      type: String,
      enum: Object.values(EnumNotifyUserType),
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'type',
    },
    address: {
      street: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        default: null,
      },
      number: {
        type: String,
        default: null,
      },
    },
    piva: {
      type: String,
      default: null,
    },
    reviewRedirect: {
      type: Schema.Types.String,
      default: null,
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
        },
      ],
      required: true,
    },
    redirectUrl: {
      type: String,
      default: null,
    },
    colors: {
      background: {
        type: [String],
        default: ['#0A2859', '#041127'],
      },
      elements: {
        type: String,
        default: '#FFFFFF',
      },
      useCompanyColors: {
        type: Boolean,
        default: false,
      },
    },
    note: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: 'Note',
    },
    profileIdentifier: {
      type: String,
      default: null,
      unique: true,
    },
    noteOptions: {
      showTitle: {
        type: Boolean,
        default: true,
      },
    },
    advancedProfile: {
      type: {
        enabled: {
          type: Boolean,
          default: false,
        },
        items: [_itemSchema],
        pageSettings: {
          type: Schema.Types.Mixed,
          default: {
            backgroundType: EnumNotifyAPBackgroundTypes.Gradient,
            gradient: {
              direction: EnumNotifyAPDirections.Vertical,
              colors: [{ value: '#000000' }, { value: '#000000' }],
            },
            textColor: '#FFFFFF',
            font: 'Poppins',
            fontSize: 16,
            align: EnumNotifyAPDirections.Vertical,
            padding: 1,
            verticalSpacing: 0.5,
          },
        },
        requiredItems: {
          avatar: {
            type: Schema.Types.ObjectId,
            default: null,
          },
          feedback: {
            type: Schema.Types.ObjectId,
            default: null,
          },
        },
      },
      default: {
        enabled: false,
        items: [],
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
      },
    },
  }
);

// 4. Aggiungi qui, se ci sono, gli hook da eseguire prima o dopo una operazione di CRUD (create, read, update, delete)
ProfileSchema.pre('save', async function (done) {
  done();
});

// 5. Aggiungi un metodo statico build per creare il nuovo Model
ProfileSchema.statics.build = (doc: Partial<Profile>) => {
  doc.colors = doc.colors || {
    background: ['#0A2859', '#041127'],
    elements: '#FFFFFF',
    useCompanyColors: false,
  };
  return new ProfileModel(doc);
};

// 6. Esporta il Model creato con la funzione model di mongoose
export const ProfileModel = model<Profile, ProfileModel>(
  'Profile',
  ProfileSchema
);
