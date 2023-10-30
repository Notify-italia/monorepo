import { Router } from 'express';
import { agentRouter } from './agent';
import { companyRouter } from './company';

const router = Router();

router.use('/company', companyRouter);
router.use('/agent', agentRouter);

export { router as ApiV1 };
