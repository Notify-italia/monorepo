import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { wLog } from 'apps/nfc-api/src/main';
import { Router } from 'express';
import { body } from 'express-validator';
import { Attachment } from 'nodemailer/lib/mailer';
import { BadRequestError } from '../../../services/errors/errors';
import { sendEmail } from '../../../services/service.email';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  body('name'),
  body('source'),
  body('email'),
  body('message'),
  body('attachments'),
  errorHandledRequest(async (req, res) => {
    const { name, source, email, message, attachments } = req.body;

    const attacchementsMapped = _base64ToArrayBuffer(attachments);

    await sendEmail({
      to: ['commerciale@notifyapp.it'],
      title: `Nuovo contatto da ${source}`,
      body: `
      <p>
      Una persona ha compilato il modulo di contatto da ${source} con i seguenti dati: 
      <br>
      Nome: ${name}
      <br>
      Email: ${email}
      <br>
      Messaggio: ${message}      
      </p>`,
      attachments: attacchementsMapped,
    }).catch((err) => {
      wLog(err, 'error');
      throw new BadRequestError("Errore nell'invio della mail");
    });

    await sendEmail({
      to: [email as string],
      title: `Grazie per il tuo interesse in Notify!`,
      body: `
    <p>Ciao <span>${name}</span>,</p>
    <p>Grazie per averci contattato! Siamo entusiasti del tuo interesse per Notify.</p>
    <p>Stiamo ancora lavorando duramente per portare l'app alla perfezione. Appena pronta, ti avviseremo immediatamente!</p>
    <p>Grazie per la tua pazienza e supporto.</p>
    <p>Resta sintonizzato!</p>
    <p>Cordiali saluti,<br>Il Team di Notify 🚀</p>`,
    }).catch((err) => {
      wLog(err, 'error');
      throw new BadRequestError("Errore nell'invio della mail");
    });

    res.status(200).send({ status: 'ok' });
  })
);

export { router as postSalesContactRouter };

const _base64ToArrayBuffer = (data: Attachment[] & { content: string }) => {
  return data.map((attachment) => {
    const content = Buffer.from(attachment.content as string, 'base64');

    return {
      ...attachment,
      content,
    };
  });
};
