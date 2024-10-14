import { Router } from 'express';
import { getStripeInvoiceRouter } from './get.invoice';

const router = Router();

router.use('/invoice', getStripeInvoiceRouter);

export { router as stripeRouter };
