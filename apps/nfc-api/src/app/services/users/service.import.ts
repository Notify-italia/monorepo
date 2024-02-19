import { EnumNotifyUserType, INotifyProfile } from '@notify/interfaces';
import csv from 'csv-parser';
import * as fs from 'fs';
import { Types } from 'mongoose';
import { AgentDocument, AgentModel } from '../../models/model.agent';
import { ProfileDocument, ProfileModel } from '../../models/model.profile';
import { BadRequestError } from '../errors/errors';
import { asyncForEach } from '../service.utils';

const pendingImports: ImportManager[] = [];

export interface IImportManagerOptions {
  parent: Types.ObjectId;
  JSON?: {
    email: string;
    password?: string;
    profile: INotifyProfile;
  }[];
  CSV?: {
    data: string;
    mappings: {
      [key: string]: string;
    };
  };
  fallbacks: {
    idProfileTemplate?: Types.ObjectId;
    generatePassword: boolean;
  };
}

export class ImportManager {
  private _documents: {
    agent: AgentDocument;
    profile: ProfileDocument;
  }[] = [];

  public get documents() {
    return this._documents.map((i) => ({
      agent: i.agent.toJSON(),
      profile: i.profile.toJSON(),
    }));
  }

  constructor(
    private instanceConfig: {
      id: string;
      options?: IImportManagerOptions;
    }
  ) {}

  public static async generate(options?: IImportManagerOptions) {
    return new ImportManager({
      options,
      id: this._generateString(),
    });
  }

  public static load(id: string) {
    return pendingImports.find((i) => i.instanceConfig.id === id);
  }

  public async createDocuments() {
    await this._createDocuments().then((d) => {
      this._documents = d;
      pendingImports.push(this);
    });
  }

  public confirm() {
    this._documents.forEach(async (i) => {
      await i.agent.save();
      await i.profile.save();
    });
  }

  private static _generateString() {
    return Math.random().toString(36).substring(2);
  }

  private async _createDocuments() {
    if (this.instanceConfig.options?.JSON) {
      return await this._createFromJSON(this.instanceConfig.options?.JSON);
    }

    if (this.instanceConfig.options?.CSV) {
      return await this._createFromCSV();
    }

    throw new BadRequestError('Nessun dato fornito');
  }

  private async _createFromJSON(data: IImportManagerOptions['JSON']) {
    const fallbacks = this.instanceConfig.options?.fallbacks;

    const noDataString = 'Nessun dato fornito';

    if (!data) {
      throw new BadRequestError('Nessun dato JSON fornito');
    }

    const results: { agent: AgentDocument; profile: ProfileDocument }[] = [];

    await asyncForEach(data, async (i) => {
      const _p = i.profile;
      const _fallbackProfile = fallbacks?.idProfileTemplate
        ? await this._fallbackProfile()
        : null;

      if (!i.password && !fallbacks?.generatePassword) {
        throw new BadRequestError(
          `Nessun password fornita per l'utente ${i.email}`
        );
      }

      const agent = await AgentModel.build(
        {
          email: i.email,
          password: i.password || this._generateString(),
          owner: this.instanceConfig.options?.parent,
        },
        {
          role: _p?.role || noDataString,
        }
      );

      const profile = ProfileModel.build({
        role: _p?.role || _fallbackProfile?.role || noDataString,
        owner: agent._id,
        name: _p?.name || noDataString,
        surname: _p?.surname || noDataString,
        type: EnumNotifyUserType.Agent,
        config: _p?.config || _fallbackProfile?.config,
        phoneNumber: _p?.phoneNumber || noDataString,
        email: _p?.email || noDataString,
        bio: _p?.bio || _fallbackProfile?.bio || noDataString,
        avatar: _p?.avatar || _fallbackProfile?.avatar,
        customFields: _p?.customFields || _fallbackProfile?.customFields,
        colors: _p?.colors || _fallbackProfile?.colors,
        redirectUrl: _p?.redirectUrl || _fallbackProfile?.redirectUrl,
      });

      results.push({ agent, profile });
    });

    return results;
  }

  private _createFromCSV() {
    const data = this.instanceConfig.options?.CSV?.data;
    const mappings = this.instanceConfig.options?.CSV?.mappings;

    if (!data || !mappings) {
      throw new BadRequestError('Nessun file CSV fornito');
    }

    let results: { agent: AgentDocument; profile: ProfileDocument }[] = [];

    fs.createReadStream(data)
      .pipe(csv())
      //   .on('data', (data) => results.push(data))
      .on('end', async (d: { [key: string]: string }[]) => {
        const _results: IImportManagerOptions['JSON'] = d.map((i) => {
          //dichiaro un oggetto result contenente i dati dell'utente e del profilo
          const result: Partial<INotifyProfile<EnumNotifyUserType.Agent>> & {
            password?: string;
          } = {};

          //per ogni chiave nell'oggetto mappings
          Object.keys(mappings).forEach((k) => {
            const profileKey = mappings[
              k
            ] as keyof INotifyProfile<EnumNotifyUserType.Agent>;

            if (!profileKey) {
              throw new BadRequestError(
                `Nessun mapping fornito per la chiave ${k}`
              );
            }

            if (!i[k]) {
              throw new BadRequestError(
                `Nessun valore fornito per la chiave ${k}`
              );
            }

            // fuck typescript sometimes
            //! se tolgo "as any" da un errore ridicolo dove dice che il tipo string non è assegnabile al tipo undefined
            result[profileKey] = i[k] as any;
          });

          if (!result.email || !result.password) {
            throw new BadRequestError(
              `Errore durante l'ottenimento dei dati dal file CSV`
            );
          }

          return {
            email: result.email,
            password: result.password,
            parent: new Types.ObjectId(i.parent),
            profile: result as INotifyProfile,
          };
        });

        results = await this._createFromJSON(_results || []);
      });

    return results;
  }

  private _generateString() {
    return Math.random().toString(36).substring(2);
  }

  private _fallbackProfile() {
    const profile = new Types.ObjectId(
      this.instanceConfig.options?.fallbacks.idProfileTemplate
    );

    if (!profile) {
      throw new BadRequestError('Nessun profilo fornito');
    }

    return ProfileModel.findById(profile);
  }
}

/*
FLUSSO

1. ImportManager.dryLoad(options) -> new ImportManager(options)
2. Passa al client un'istanza di ImportManager con le opzioni specificate
3. il client effettua una chiamata di conferma per l'importazione
4. ImportManager.confirm() -> void
*/
