import {
  EnumNotifyUserType,
  INotifyCompany,
  INotifyProfile,
} from '@notify/interfaces';
import {
  AgentDocument,
  AgentModel,
  ProfileDocument,
  ProfileModel,
} from '@notify/nfc-api-core';
import csv from 'csv-parser';
import * as fs from 'fs';
import { Types } from 'mongoose';
import { BadRequestError } from '../errors/errors';
import { agentCreatedEmail } from '../service.email';
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
    path?: string;
    separator?: string;
    mappings: {
      [key in keyof INotifyProfile]: string;
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

  public plainTextPasswords: {
    email: string;
    password: string;
  }[] = [];

  public get documents() {
    return this._documents.map((i) => ({
      agent: i.agent.toJSON(),
      profile: i.profile.toJSON(),
    }));
  }

  public get instance() {
    return { ...this, _plainTextPasswords: undefined };
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
    const result = pendingImports.find((i) => i.instanceConfig.id === id);
    if (!result) {
      throw new BadRequestError('Nessuna importazione trovata');
    }
    return result;
  }

  public async createDocuments() {
    this._documents = await this._createDocuments();
    pendingImports.push(this);
  }

  public async processDocuments(
    currentUser: INotifyCompany,
    sendEmails: boolean
  ) {
    await asyncForEach(this._documents, async (i) => {
      await i.agent.save();
      await i.profile.save();

      const password =
        this.plainTextPasswords.find((p) => p.email === i.agent.email)
          ?.password || `ERRORE DURANTE L'OTTENIMENTO DELLA PASSWORD`;

      if (sendEmails) {
        await agentCreatedEmail(
          i.agent.email,
          currentUser.email as string,
          password
        );
      }

      pendingImports.splice(pendingImports.indexOf(this), 1);
    });
  }

  private static _generateString() {
    return Math.random().toString(36).substring(2);
  }

  private async _createDocuments() {
    if (this.instanceConfig.options?.JSON) {
      //se è stato fornito un oggetto JSON effettuo l'importazione da esso
      return await this._createFromJSON(this.instanceConfig.options?.JSON);
    }

    if (this.instanceConfig.options?.CSV) {
      //se è stato fornito un file CSV effettuo l'importazione da esso
      return await this._createFromCSV();
    }

    //se non è stato fornito nessun dato effettuo un throw errore
    throw new BadRequestError('Nessun dato fornito');
  }

  private async _createFromJSON(data: IImportManagerOptions['JSON']) {
    //estraggo i fallbacks dalle opzioni
    const fallbacks = this.instanceConfig.options?.fallbacks;

    const noDataString = '';

    if (!data) {
      //se non ci sono dati forniti effettuo un throw errore
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

      const password = i.password || this._generateString();

      const agent = await AgentModel.build(
        {
          email: i.email,
          password,
          owner: this.instanceConfig.options?.parent,
        },
        {
          role: _p?.role || noDataString,
          feedbackEnabled: _p?.config?.feedbackEnabled ?? false,
        },
        true
      );

      this.plainTextPasswords.push({ email: i.email, password });

      const profile = ProfileModel.build({
        role: _p?.role || _fallbackProfile?.role || noDataString,
        owner: agent._id,
        name: _p?.name || noDataString,
        surname: _p?.surname || noDataString,
        type: EnumNotifyUserType.Agent,
        config: _p?.config || _fallbackProfile?.config,
        phoneNumber: _p?.phoneNumber || noDataString,
        email: _p?.email || agent.email || noDataString,
        bio: _p?.bio || _fallbackProfile?.bio || noDataString,
        avatar: _p?.avatar,
        customFields: _p?.customFields || _fallbackProfile?.customFields,
        colors: _p?.colors || _fallbackProfile?.colors,
        redirectUrl: _p?.redirectUrl || _fallbackProfile?.redirectUrl,
      });

      profile.config.feedbackEnabled = _p?.config?.feedbackEnabled ?? false;
      profile.role = _p?.role || _fallbackProfile?.role || noDataString;

      results.push({ agent, profile });
    });

    return results;
  }

  private async _createFromCSV() {
    //estraggo il path, il separator e i mappings dalle opzioni
    const path = this.instanceConfig.options?.CSV?.path;
    const separator = this.instanceConfig.options?.CSV?.separator || ',';
    const mappings = this.instanceConfig.options?.CSV?.mappings;

    if (!path || !mappings) {
      throw new BadRequestError('Nessun file CSV fornito');
    }

    let csvObject: { [key: string]: string }[] = [];
    let results: { agent: AgentDocument; profile: ProfileDocument }[] = [];

    await new Promise((r) =>
      fs
        .createReadStream(path)
        .pipe(
          csv({
            separator,
          })
        )
        .on('data', (d: { [key: string]: string }) => {
          csvObject.push(d);
        })
        .on('end', async () => {
          r(csvObject);
        })
    );

    const _results: IImportManagerOptions['JSON'] = csvObject
      .filter((i) => i)
      .map((i) => {
        //dichiaro un oggetto result contenente i dati dell'utente e del profilo
        const result: Partial<INotifyProfile<EnumNotifyUserType.Agent>> & {
          password?: string;
        } = {};

        //per ogni chiave nell'oggetto mappings
        (Object.keys(mappings) as (keyof INotifyProfile)[]).forEach((k) => {
          const profileKey = mappings[
            k
          ] as keyof INotifyProfile<EnumNotifyUserType.Agent>;

          if (!profileKey) {
            throw new BadRequestError(
              `Nessun mapping fornito per la chiave ${k}`
            );
          }

          if (!i[profileKey]) {
            throw new BadRequestError(
              `Nessun valore fornito per la chiave ${k}`
            );
          }

          // fuck typescript sometimes
          //! se tolgo "as any" da un errore ridicolo dove dice che il tipo string non è assegnabile al tipo undefined
          result[k] = i[profileKey] as any;
        });

        if (!result.email) {
          throw new BadRequestError(
            `Errore durante l'ottenimento dei dati dal file CSV, nessuna email o password ottenibile`
          );
        }

        return {
          email: result.email,
          password: result.password,
          parent: new Types.ObjectId(i.parent),
          profile: result as INotifyProfile,
        };
      });

    results = await this._createFromJSON(_results);

    fs.unlinkSync(path);

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
