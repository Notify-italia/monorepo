import { Router } from 'express';
import { getProfileRouter } from './get';

const router = Router();

router.use('/', getProfileRouter);

export { router as profileRouter };
