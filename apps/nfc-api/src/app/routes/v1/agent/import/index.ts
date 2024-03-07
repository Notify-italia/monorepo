import { Router } from 'express';
import { postConfirmAgentsImportRouter } from './post.confirm';
import { postGenerateAgentsRouter } from './post.generate';

const router = Router();

router.use('/generate', postGenerateAgentsRouter);
router.use('/confirm', postConfirmAgentsImportRouter);

export { router as importAgentsRouter };
