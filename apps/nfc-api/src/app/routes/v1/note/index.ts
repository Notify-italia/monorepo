import { Router } from 'express';
import { getNoteRouter } from './get';
import { postNoteRouter } from './post';

const router = Router();

router.use('/', getNoteRouter);
router.use('/', postNoteRouter);

export { router as noteRouter };
