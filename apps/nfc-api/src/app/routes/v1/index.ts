import { Router } from 'express';
import { agentRouter } from './agent';
import { companyRouter } from './company';
import { feedbackRouter } from './feedback';
import { profileRouter } from './profile';

const router = Router();

router.use('/company', companyRouter);
router.use('/agent', agentRouter);
router.use('/profile', profileRouter);
router.use('/feedback', feedbackRouter);

export { router as ApiV1 };
