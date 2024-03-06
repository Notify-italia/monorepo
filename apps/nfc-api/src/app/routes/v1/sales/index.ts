import { Router } from 'express';
import { postSalesContactRouter } from './post.contact';

const router = Router();

router.use('/contact', postSalesContactRouter);

export { router as SalesRouter };
