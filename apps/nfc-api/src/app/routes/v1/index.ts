import { Router } from 'express';
import { agentRouter } from './agent';
import { companyRouter } from './company';
import { feedbackRouter } from './feedback';
import { noteRouter } from './note';
import { postTestRouter } from './post.test-route';
import { profileRouter } from './profile';
import { SalesRouter } from './sales';
import { statRouter } from './stat';

const router = Router();

router.use('/company', companyRouter);
router.use('/agent', agentRouter);
router.use('/profile', profileRouter);
router.use('/feedback', feedbackRouter);
router.use('/notes', noteRouter);
router.use('/stat', statRouter);
router.use('/sales', SalesRouter);
router.use('/test', postTestRouter);

export { router as ApiV1 };
