import { Router } from 'express';
import { postFeedbackRouter } from './post';

const router = Router();

router.use('/', postFeedbackRouter);

export { router as feedbackRouter };
