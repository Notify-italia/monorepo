import { Router } from 'express';
import { deleteCustomerRouter } from './delete.customer';
import { deleteCustomerStatsRouter } from './delete.customer.stats';
import { deleteLicenseRouter } from './delete.license';
import { getCustomerRouter } from './get.customer';
import { getCustomersRouter } from './get.customers';
import { getDashboardRouter } from './get.dashboard';
import { getHeartbeatRouter } from './get.heartbeat';
import { getLicensesRouter } from './get.licenses';
import { patchLicenseRouter } from './patch.license';
import { postCustomerGenerateTokenRouter } from './post.customer.generate-token';
import { postEmailRouter } from './post.email';
import { postLicenseRouter } from './post.license';
import { postTestRouter } from './post.test-route';
import { stripeRouter } from './stripe';

const router = Router();

router.use('/test', postTestRouter);
router.use('/heartbeat', getHeartbeatRouter);
router.use('/customers', getCustomersRouter);
router.use('/dashboard', getDashboardRouter);
router.use('/customer', deleteCustomerRouter);
router.use('/customer/stats', deleteCustomerStatsRouter);
router.use('/customer', getCustomerRouter);
router.use('/licenses', getLicensesRouter);
router.use('/license', postLicenseRouter);
router.use('/license', patchLicenseRouter);
router.use('/license', deleteLicenseRouter);
router.use('/customer/generate-token', postCustomerGenerateTokenRouter);
router.use('/stripe', stripeRouter);
router.use('/email', postEmailRouter);

export { router as ApiV1 };
