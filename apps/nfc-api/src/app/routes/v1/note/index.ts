import { Router } from 'express';
import { deleteNoteRouter } from './delete';
import { getNoteRouter } from './get';
import { getLatestNoteRouter } from './get.latest';
import { patchNoteRouter } from './patch';
import { postNoteRouter } from './post';

const router = Router();

router.use('/', getNoteRouter);
router.use('/latest', getLatestNoteRouter);
router.use('/', postNoteRouter);
router.use('/', patchNoteRouter);
router.use('/', deleteNoteRouter);

export { router as noteRouter };
