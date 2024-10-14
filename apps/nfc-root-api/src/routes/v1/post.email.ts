import { requestHandler, sendEmail } from '@notify/nfc-api-core';
import { Router } from 'express';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/',
  body('address').isString().withMessage('Indirizzo non valido'),
  body('title').isString().withMessage('Titolo non valido'),
  body('content').isString().withMessage('Contenuto non valido'),
  requestHandler(
    async (req, res) => {
      const { address, content, title } = req.body;

      await sendEmail({
        to: [address as string],
        title: title as string,
        body: content as string,
      });
    },
    {
      errorMessage: 'ERRORE!',
      requireApiKey: true,
    }
  )
);

export { router as postEmailRouter };
