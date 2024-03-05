import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { Router } from 'express';
import { query } from 'express-validator';
import { sendEmail } from '../../../services/service.email';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('name'),
  query('source'),
  query('email'),
  query('message'),
  query('extraData'),
  errorHandledRequest(async (req, res) => {
    const { name, source, email, message, extraData } = req.query;

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
      ${
        extraData
          ? `<br>
        Altri dati: ${extraData}`
          : ''
      }
      
      </p>`,
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
    });

    res.status(200).send({ status: 'ok' });
  })
);

export { router as getSalesContactRouter };
