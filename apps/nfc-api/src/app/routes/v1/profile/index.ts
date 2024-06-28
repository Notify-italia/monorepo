import { Router } from 'express';
import { deleteProfileFileRouter } from './delete.file';
import { getProfileRouter } from './get';
import { getV2BetaAccessRouter } from './get.v2-beta-access';
import { patchProfileRouter } from './patch';
import { postCheckProfileIdentifierRouter } from './post.check-identifier';
import { postProfileFileRouter } from './post.file';
import { postTranslateProfileRouter } from './post.translate';
import { postProfileV2UpdateRouter } from './post.v2-update';

const router = Router();

router.use('/', getProfileRouter);
router.use('/', patchProfileRouter);
router.use('/translate', postTranslateProfileRouter);
router.use('/file', postProfileFileRouter);
router.use('/file', deleteProfileFileRouter);
router.use('/check-identifier', postCheckProfileIdentifierRouter);
router.use('/v2-update', postProfileV2UpdateRouter);
router.use('/v2-beta-access', getV2BetaAccessRouter);

export { router as profileRouter };
