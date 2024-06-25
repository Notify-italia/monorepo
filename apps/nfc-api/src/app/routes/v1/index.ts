import { Router } from 'express';
import { agentRouter } from './agent';
import { companyRouter } from './company';
import { feedbackRouter } from './feedback';
import { getHeartbeatRouter } from './get.heartbeat';
import { googleAPIRouter } from './google-api';
import { LeadRouter } from './lead';
import { noteRouter } from './note';
import { OpenAIRouter } from './openai';
import { postTestRouter } from './post.test-route';
import { profileRouter } from './profile';
import { s3Router } from './s3';
import { SalesRouter } from './sales';
import { statRouter } from './stat';
import { utilsRouter } from './utils';

const router = Router();

router.use('/company', companyRouter);
router.use('/agent', agentRouter);
router.use('/profile', profileRouter);
router.use('/feedback', feedbackRouter);
router.use('/notes', noteRouter);
router.use('/stat', statRouter);
router.use('/sales', SalesRouter);
router.use('/test', postTestRouter);
router.use('/heartbeat', getHeartbeatRouter);
router.use('/google', googleAPIRouter);
router.use('/utils', utilsRouter);
router.use('/s3', s3Router);
router.use('/lead', LeadRouter);
router.use('/openai', OpenAIRouter);

export { router as ApiV1 };
