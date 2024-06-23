import { Router } from 'express';
import { postBusinesscardDataRouter } from './post.businesscard-data';

const router = Router();

router.use('/businesscard-data', postBusinesscardDataRouter);

export { router as OpenAIRouter };
