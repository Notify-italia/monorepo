import { Router } from 'express';
import { agentRouter } from './agent';
import { companyRouter } from './company';
import { profileRouter } from './profile';

const router = Router();

router.use('/company', companyRouter);
router.use('/agent', agentRouter);
router.use('/profile', profileRouter);

export { router as ApiV1 };
