import * as crypto from 'crypto';
import { wLog } from '../../main';
import { Company, CompanyModel } from '../models/model.company';
import {
  LICENSE_VALIDATION_MESSAGES,
  LicenseDocument,
  LicenseModel,
} from '../models/model.license';
import { BadRequestError } from './errors/errors';

export class LicenseManager {
  public get license(): LicenseDocument {
    return this._license;
  }

  constructor(private _license: LicenseDocument) {}

  public async assign(id: Company['_id']): Promise<void> {
    const company = await CompanyModel.findById(id);

    if (!company) {
      wLog(
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

  public static async load(options: { publicKey?: string; id?: string }) {
    if (options.id) {
      return await this._findWithId(options.id);
    }

    if (options.publicKey) {
      return await this._find(options.publicKey);
    }

    throw new BadRequestError(LICENSE_VALIDATION_MESSAGES.publicKey as string);
  }

  private static async _findWithId(id: string): Promise<LicenseManager> {
    const license = await LicenseModel.findById(id);

    if (!license || !license.enabled) {
      throw new BadRequestError(
        LICENSE_VALIDATION_MESSAGES.publicKey as string
      );
    }

    return new LicenseManager(license);
  }

  private static async _find(publicKey: string): Promise<LicenseManager> {
    const license = await LicenseModel.findOne({ publicKey });

    if (!license || !license.enabled) {
      throw new BadRequestError(
        LICENSE_VALIDATION_MESSAGES.publicKey as string
      );
    }

    const isAssigned = await CompanyModel.findOne({
      license: license._id,
    });

    if (isAssigned) {
      wLog(
        `license with publicKey: ${publicKey} is already assigned to company with id: ${isAssigned._id}`,
        'error'
      );
      throw new BadRequestError(
        LICENSE_VALIDATION_MESSAGES.publicKey as string
      );
    }

    return new LicenseManager(license);
  }

  public static async generate(conf: {
    expirationDate: Date;
    allowedAgents: number;
  }): Promise<LicenseManager> {
    const l = await LicenseModel.build({
      expirationDate: conf.expirationDate,
      enabled: true,
      publicKey: this._generatePublicKey(),
      allowedAgents: conf.allowedAgents,
    });

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
