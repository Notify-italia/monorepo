import nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';
import { wLog } from '../../main';
import { declareEnvs, isProduction } from './service.envs';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASSWORD,
  DEBUG_EMAIL,
} = declareEnvs([
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'SMTP_FROM',
  'SMTP_HOST',
  'DEBUG_EMAIL',
]);
export interface ISendEmailOptions {
  emails: string[];
  subject: string;
  text?: string;
  attachments?: { path: string; filename: string; cid?: string }[];
  transporter?: {
    fromLabel: string;
    host: string;
    port: number;
    secure: boolean;
    auth: { user: string; pass: string };
    replyTo?: string;
  };
}

//aggiungere funzione che manda email di conferma operazione all'email che ha richiesto il servizio.
const defaultTransporter = nodemailer.createTransport({
  host: String(SMTP_HOST),
  port: Number(SMTP_PORT),
  secure: Boolean(SMTP_SECURE),
  auth: {
    user: String(SMTP_USER),
    pass: String(SMTP_PASSWORD),
  },
});

export const sendEmail = async (config: {
  to: string[];
  title: string;
  body?: string;
  attachments?: Attachment[];
  transporter?: {
    fromLabel: string;
    host: string;
    port: number;
    secure: boolean;
    auth: { user: string; pass: string };
    replyTo?: string;
  };
}) => {
  const { to, title, body: text, attachments, transporter } = config;

  const emails = isProduction() ? to : [DEBUG_EMAIL];

  const activeTransporter = transporter
    ? nodemailer.createTransport(transporter)
    : defaultTransporter;

  const email = await activeTransporter
    .sendMail({
      from: transporter?.fromLabel || process.env.SMTP_FROM,
      to: emails.join(', '),
      subject: title,
      html:
        text +
        `<br><br><i><small>Questa è una mail automatica, Si prega di non ripondere direttamente e di contattarci a <a href="mailto:supporto@notifyapp.it">supporto@notifyapp.it</a> per qualsiasi domanda o problema.
        </small></i><br>`,
      attachments,
    })
    .catch((error) => {
      wLog('error', error);
    });

  return email;
};
