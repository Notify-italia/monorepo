import { Router } from 'express';
import { getCustomerRouter } from './get.customer';
import { getCustomersRouter } from './get.customers';
import { getHeartbeatRouter } from './get.heartbeat';
import { postTestRouter } from './post.test-route';

const router = Router();

router.use('/test', postTestRouter);
router.use('/heartbeat', getHeartbeatRouter);
router.use('/customers', getCustomersRouter);
router.use('/customer', getCustomerRouter);

export { router as ApiV1 };
