import { Router } from 'express';
import { deleteProfileFileRouter } from './delete.file';
import { getProfileRouter } from './get';
import { patchProfileRouter } from './patch';
import { postCheckProfileIdentifierRouter } from './post.check-identifier';
import { postProfileFileRouter } from './post.file';

const router = Router();

router.use('/', getProfileRouter);
router.use('/', patchProfileRouter);
router.use('/file', postProfileFileRouter);
router.use('/file', deleteProfileFileRouter);
router.use('/check-identifier', postCheckProfileIdentifierRouter);

export { router as profileRouter };
