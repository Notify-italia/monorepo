import { Router } from 'express';
import { postGenerateAgentsRouter } from './post.generate';

const router = Router();

router.use('/generate', postGenerateAgentsRouter);

export { router as importAgentsRouter };
