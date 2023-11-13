import { Router } from 'express';
import { getProfileRouter } from './get';
import { patchProfileRouter } from './patch';

const router = Router();

router.use('/', getProfileRouter);
router.use('/', patchProfileRouter);

export { router as profileRouter };
