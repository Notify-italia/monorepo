import { Router } from 'express';
import { getCustomerRouter } from './get.customer';
import { getCustomersRouter } from './get.customers';
import { getDashboardRouter } from './get.dashboard';
import { getHeartbeatRouter } from './get.heartbeat';
import { postCustomerGenerateTokenRouter } from './post.customer.generate-token';
import { postTestRouter } from './post.test-route';

const router = Router();

router.use('/test', postTestRouter);
router.use('/heartbeat', getHeartbeatRouter);
router.use('/customers', getCustomersRouter);
router.use('/dashboard', getDashboardRouter);
router.use('/customer', getCustomerRouter);
router.use('/customer/generate-token', postCustomerGenerateTokenRouter);

export { router as ApiV1 };
