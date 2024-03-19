import { Router } from 'express';
import { getPixelTrackerRouter } from './get.pixel';
import { postSalesContactRouter } from './post.contact';

const router = Router();

router.use('/contact', postSalesContactRouter);
router.use('/pixel', getPixelTrackerRouter);

export { router as SalesRouter };
