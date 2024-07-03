import { INotifyCompany, INotifyLicense } from '@notify/interfaces';
import * as crypto from 'crypto';
import { BadRequestError } from '../errors';
import {
  AgentModel,
  Company,
  CompanyModel,
  LICENSE_VALIDATION_MESSAGES,
  LicenseDocument,
  LicenseModel,
} from '../models';
import { mLog } from '../services';

export class LicenseManager {
  public get value(): LicenseDocument {
    return this._license;
  }

  constructor(private _license: LicenseDocument) {}

  public get isActive(): boolean {
    return (
      (this.value.expirationDate === null ||
        this.value.expirationDate > new Date()) &&
      this.value.enabled
    );
  }

  public async assign(id: Company['_id']): Promise<void> {
    const company = await CompanyModel.findById(id);

    if (!company) {
      mLog(
        `company with id: ${id} not found while activating license with publicKey: ${this._license.publicKey}`,
        'error'
      );
      throw new BadRequestError(
        LICENSE_VALIDATION_MESSAGES.publicKey as string
      );
    }

    company.license = this._license._id;
    await company.save();
  }

  public async delete() {
    await LicenseModel.findOneAndRemove({ _id: this._license._id });
  }

  public async patch(conf: Partial<INotifyLicense>): Promise<void> {
    this._license.expirationDate = (conf.expirationDate ||
      null) as unknown as Date;

    this._license.allowedAgents =
      conf.allowedAgents || this._license.allowedAgents || 1;

    this._license.boughtCards =
      conf.boughtCards ?? this._license.boughtCards ?? 0;

    this.value.enabled = conf.enabled ?? this.value.enabled ?? true;

    this.value.features = conf.features || this.value.features || [];

    await this._license.save();
  }

  public static async load(options: {
    publicKey?: string;
    id?: string;
    agent?: string;
    company?: string;
    ignoreDisabled?: boolean;
  }) {
    if (options.id) {
      return await this._findWithId(
        options.id,
        options.ignoreDisabled ?? false
      );
    }

    if (options.publicKey) {
      return await this._find(
        options.publicKey,
        options.ignoreDisabled ?? false
      );
    }

    if (options.agent) {
      return await this._findByAgent(options.agent);
    }

    if (options.company) {
      return await this._findByCompany(options.company);
    }

    throw new BadRequestError(LICENSE_VALIDATION_MESSAGES.publicKey as string);
  }

  private static async _findByAgent(agentId: string): Promise<LicenseManager> {
    const agent = await AgentModel.findById(agentId)
      .populate({
        path: 'owner',
      })
      .lean();

    if (!agent || !agent.owner) {
      throw new BadRequestError('Licenza non valida');
    }

    return await this._findWithId(
      (agent.owner as unknown as INotifyCompany).license,
      false
    );
  }

  private static async _findByCompany(
    companyId: string
  ): Promise<LicenseManager> {
    const company = await CompanyModel.findById(companyId);

    if (!company || !company.license) {
      throw new BadRequestError('Licenza non valida');
    }

    return await this._findWithId(String(company.license), false);
  }

  private static async _findWithId(
    id: string,
    ignoreDisabled: boolean
  ): Promise<LicenseManager> {
    const license = (await LicenseModel.findById(id)) as LicenseDocument;

    if (!license || (!license.enabled && !ignoreDisabled)) {
      throw new BadRequestError(
        LICENSE_VALIDATION_MESSAGES.publicKey as string
      );
    }

    return new LicenseManager(license);
  }

  private static async _find(
    publicKey: string,
    ignoreDisabled: boolean
  ): Promise<LicenseManager> {
    const license = (await LicenseModel.findOne({
      publicKey,
    })) as LicenseDocument;

    if (!license || (!license.enabled && !ignoreDisabled)) {
      throw new BadRequestError(
        LICENSE_VALIDATION_MESSAGES.publicKey as string
      );
    }

    const isAssigned = await CompanyModel.findOne({
      license: license._id,
    });

    if (isAssigned) {
      mLog(
        `license with publicKey: ${publicKey} is already assigned to company with id: ${isAssigned._id}`,
        'error'
      );
      throw new BadRequestError(
        LICENSE_VALIDATION_MESSAGES.publicKey as string
      );
    }

    return new LicenseManager(license);
  }

  public static async generate(
    conf: Partial<INotifyLicense>
  ): Promise<LicenseManager> {
    const l = (await LicenseModel.build({
      expirationDate: conf.expirationDate,
      enabled: true,
      publicKey: this._generatePublicKey(),
      allowedAgents: conf.allowedAgents,
      boughtCards: conf.boughtCards,
      features: conf.features,
    })) as LicenseDocument;

    await l.save();

    return new LicenseManager(l);
  }

  private static _generatePublicKey(): string {
    const secret = 'a secret key';
    const _hash = crypto
      .createHmac('sha256', secret)
      .update(Date.now().toString())
      .digest('hex')
      .toUpperCase();

    const hash = _hash.slice(0, 32);

    let formattedHash = '';
    for (let i = 0; i < hash.length; i++) {
      if (i !== 0 && i % 8 === 0) {
        formattedHash += '-';
      }
      formattedHash += hash[i];
    }

    return formattedHash;
  }
}
