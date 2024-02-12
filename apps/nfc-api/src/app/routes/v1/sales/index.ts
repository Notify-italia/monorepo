import { Router } from 'express';
import { getSalesContactRouter } from './contact';

const router = Router();

router.use('/contact', getSalesContactRouter);

export { router as ApiV1 };
