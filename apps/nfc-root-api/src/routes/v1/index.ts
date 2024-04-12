import { Router } from 'express';
import { deleteLicenseRouter } from './delete.license';
import { getCustomerRouter } from './get.customer';
import { getCustomersRouter } from './get.customers';
import { getDashboardRouter } from './get.dashboard';
import { getHeartbeatRouter } from './get.heartbeat';
import { getLicensesRouter } from './get.licenses';
import { patchLicenseRouter } from './patch.license';
import { postCustomerGenerateTokenRouter } from './post.customer.generate-token';
import { postLicenseRouter } from './post.license';
import { postTestRouter } from './post.test-route';

const router = Router();

router.use('/test', postTestRouter);
router.use('/heartbeat', getHeartbeatRouter);
router.use('/customers', getCustomersRouter);
router.use('/dashboard', getDashboardRouter);
router.use('/customer', getCustomerRouter);
router.use('/licenses', getLicensesRouter);
router.use('/license', postLicenseRouter);
router.use('/license', patchLicenseRouter);
router.use('/license', deleteLicenseRouter);
router.use('/customer/generate-token', postCustomerGenerateTokenRouter);

export { router as ApiV1 };
