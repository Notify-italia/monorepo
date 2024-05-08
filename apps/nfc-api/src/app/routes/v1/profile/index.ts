import { Router } from 'express';
import { getProfileRouter } from './get';
import { patchProfileRouter } from './patch';
import { postCheckProfileIdentifierRouter } from './post.check-identifier';

const router = Router();

router.use('/', getProfileRouter);
router.use('/', patchProfileRouter);
router.use('/check-identifier', postCheckProfileIdentifierRouter);

export { router as profileRouter };
