import { Router } from 'express';
import { getSalesContactRouter } from './get.contact';

const router = Router();

router.use('/contact', getSalesContactRouter);

export { router as SalesRouter };
