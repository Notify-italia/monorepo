import { Router } from 'express';
import { deleteNoteRouter } from './delete';
import { deleteNoteFileRouter } from './delete.file';
import { getNoteRouter } from './get';
import { getLatestNoteRouter } from './get.latest';
import { patchNoteRouter } from './patch';
import { postNoteRouter } from './post';
import { postNoteFileRouter } from './post.file';

const router = Router();

router.use('/', getNoteRouter);
router.use('/latest', getLatestNoteRouter);
router.use('/', postNoteRouter);
router.use('/file', postNoteFileRouter);
router.use('/file', deleteNoteFileRouter);
router.use('/', patchNoteRouter);
router.use('/', deleteNoteRouter);

export { router as noteRouter };
