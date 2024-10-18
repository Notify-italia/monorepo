import { requestHandler } from '@notify/nfc-api-core';
import { stripe } from 'apps/nfc-root-api/src/main';
import { Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  requestHandler(
    async (req, res) => {
      const invoices = await stripe.invoices.list({
        limit: 25,
        status: 'paid',
      });

      res.send(invoices.data);
    },
    {
      errorMessage: 'ERRORE!',
      requireApiKey: true,
    }
  )
);

export { router as getStripeInvoicesRouter };
