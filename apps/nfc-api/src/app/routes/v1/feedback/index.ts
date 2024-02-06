import { Router } from 'express';
import { getFeedbackRouter } from './get';
import { postFeedbackRouter } from './post';

const router = Router();

router.use('/', postFeedbackRouter);
router.use('/', getFeedbackRouter);

export { router as feedbackRouter };
