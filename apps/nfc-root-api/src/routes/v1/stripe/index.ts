import { Router } from 'express';
import { getStripeInvoiceRouter } from './get.invoice';
import { getStripeInvoicesRouter } from './get.invoices';

const router = Router();

router.use('/invoice', getStripeInvoiceRouter);
router.use('/invoices', getStripeInvoicesRouter);

export { router as stripeRouter };
