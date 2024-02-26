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
  errorHandledRequest(async (req, res) => {
    const { name, source, email, message } = req.query;

    await sendEmail({
      to: ['vendite@notifyapp.it'],
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
    });

    await sendEmail({
      to: [email as string],
      title: `Grazie per averci contattato`,
      body: `
      <p>
      Grazie per averci contattato! 
      <br>
      Un nostro commerciarle ti risponderà al più presto.
      </p>
      
      <p>
      Il team di Notify
      </p>`,
    });

    res.status(200).send({ status: 'ok' });
  })
);

export { router as getSalesContactRouter };
