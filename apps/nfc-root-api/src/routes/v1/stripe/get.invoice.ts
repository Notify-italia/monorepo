import { requestHandler } from '@notify/nfc-api-core';
import { stripe } from 'apps/nfc-root-api/src/main';
import { Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('invoiceId').isString().withMessage('Invoice ID must be a string'),
  requestHandler(
    async (req, res) => {
      const { invoiceId } = req.query;

      const invoice = await stripe.invoices.retrieve(invoiceId as string);

      res.send(invoice);
    },
    {
      errorMessage: 'ERRORE!',
      requireApiKey: true,
    }
  )
);

export { router as getStripeInvoiceRouter };
