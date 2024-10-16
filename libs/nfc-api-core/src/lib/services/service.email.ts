import nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';
import { BadRequestError } from '../errors';
import { mLog } from '../services';
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
  bcc?: string[];
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
  const { to, title, body: text, attachments, transporter, bcc } = config;

  const emails = isProduction() ? to : [DEBUG_EMAIL];

  const activeTransporter = transporter
    ? nodemailer.createTransport(transporter)
    : defaultTransporter;

  const email = await activeTransporter
    .sendMail({
      from: transporter?.fromLabel || process.env.SMTP_FROM,
      to: emails.join(', '),
      subject: title,
      bcc,
      html:
        text +
        `<br><br><i><small>Questa è una mail automatica, Si prega di non ripondere direttamente e di contattarci a <a href="mailto:supporto@notifyapp.it">supporto@notifyapp.it</a> per qualsiasi domanda o problema.
        </small></i><br>`,
      attachments,
    })
    .catch((error) => {
      mLog('error', error);
    });

  return email;
};

export const agentCreatedEmail = async (
  email: string,
  companyEmail: string,
  password: string
) => {
  await sendEmail({
    to: [email],
    title: 'Benvenuto in Notify!',
    body: `<p>Ciao,</p>
    <p>Ricevi questa mail perchè "${companyEmail}" ha creato un account utente Notify con il tuo indirizzo mail.</p>
    <p>Di seguito troverai i dettagli del tuo account:</p>
    <ul>
        <li><strong>email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
    </ul>
    <p>
    Notify è disponibile come app Nativa per Android e iOS, oppure come web app. Puoi scaricare l'app da <a href="https://notifyapp.it/download">https://notifyapp.it/download</a> o accedere direttamente alla web app da <a href="https://app.notifyapp.it">https://app.notifyapp.it</a>.
    </p>
    <p>Ti consigliamo di conservare attentamente queste informazioni. Per qualsiasi domanda o supporto riguardante il tuo account, ti preghiamo di contattare direttamente il team IT della tua azienda.</p>
    <p>Ricordati che la sicurezza del tuo account è di fondamentale importanza. Ti invitiamo a non condividere queste informazioni con nessuno e ad adottare pratiche di sicurezza adeguate.</p>
    <p>Se hai bisogno di ulteriori informazioni o assistenza, non esitare a contattarci a <a href="mailto:supporto@notifyapp.it">supporto@notifyapp.it</a>. Siamo qui per aiutarti.</p>
    <p>Grazie per la tua collaborazione e benvenuto ufficialmente in Notify!.</p>
    <p>Cordiali saluti,<br>
    Il team Notify`,
  }).catch((err) => {
    mLog(err, 'error');
    throw new BadRequestError(
      `Errore durante l'invio della email di conferma crezione per l'utente "${email}"`
    );
  });
};
