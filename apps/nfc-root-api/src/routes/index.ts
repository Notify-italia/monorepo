import { Router } from 'express';
import { ApiV1 } from './v1';

const router = Router();

router.use('/v1', ApiV1);

export { router as api };
