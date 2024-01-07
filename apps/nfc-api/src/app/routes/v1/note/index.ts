import { Router } from 'express';
import { getNoteRouter } from './get';
import { patchNoteRouter } from './patch';
import { postNoteRouter } from './post';

const router = Router();

router.use('/', getNoteRouter);
router.use('/', postNoteRouter);
router.use('/', patchNoteRouter);

export { router as noteRouter };
