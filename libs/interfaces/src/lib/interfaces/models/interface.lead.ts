import { ModifyDeep } from '../../types.utils';
import { MongodbDocument } from '../interface.mongodb';
import { INotifyUser, INotifyUserLite } from '../interface.user';
import { INotifyProfile } from './interface.profile';

export interface INotifyLead extends MongodbDocument {
  /**
   * Utente che per primo ha creato questo contatto
   */
  createdBy: INotifyUser['_id'];
  /**
   * Colore del contatto
   */
  color: string;
  /**
   * Nome del contatto
   */
  name: string;
  /**
   * Cognome del contatto
   */
  surname: string;
  /**
   * Azienda del contatto
   */
  company: string;
  /**
   * Avatar del contatto, la maggior parte delle volte rimarrà vuoto
   */
  avatar: string;
  /**
   * Numeri di telefono del contatto
   */
  phoneNumbers: string[];
  emails: string[];
  /**
   * Note definite dagli utenti che hanno accesso a questo contatto
   */
  notes: {
    createdBy: INotifyUser['_id'];
    note: string;
  }[];

  /**
   * Origine del lead (es. modulo contatti del profilo, scansione biglietto da visita, ecc...)
   */
  origin: EnumNotifyLeadOrigins;
  /**
   * Instagram, facebook, sito web, ecc...
   */
  socials: {
    name: string;
    url: string;
  }[];
  /**
   * Se valorizzato, ottieni il profilo di questo lead e usa i dati al suo interno invece di quelli di questo lead
   */
  notifyProfile: INotifyProfile['_id'];
  /**
   * utenti che possono visualizzare questo lead nella rubrica
   */
  sharedBy: INotifyUser['_id'][];
  /**
   * lead confermato da un utente
   */
  accepted: boolean;
  /**
   * indirizzo del contatto
   */
  address: string;
  /**
   * lead eliminato
   */
  deleted: boolean;
  /**
   * ruolo del contatto
   */
  role: string;
}

export enum EnumNotifyLeadOrigins {
  ProfileContactForm = 'profile-contact-form',
  BusinessCardOCRScan = 'business-card-ocr-scan',
  NotifyProfileSave = 'notify-profile',
}

export type INotifyPopulatedLead = ModifyDeep<
  INotifyLead,
  {
    createdBy: INotifyUserLite;
    notifyProfile: INotifyProfile;
    sharedBy: INotifyUserLite[];
    notes: {
      createdBy: INotifyUserLite;
      note: string;
    }[];
  }
>;
