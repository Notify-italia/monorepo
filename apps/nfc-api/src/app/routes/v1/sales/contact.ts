import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('name'),
  query('source'),
  query('companyName'),
  query('contact'),
  errorHandledRequest(async (req, res) => {
    const { name, source, companyName, contact } = req.query;

    // await sendEmail(
    //     Bun.env['NOTIFY_EMAIL'],
    //     'Nuova richiesta di contatto',
    //     `Nome: ${name} \n Azienda: ${companyName} \n Contatto: ${contact} \n Fonte: ${source}`

    // )
  })
);

export { router as getProfileRouter };
