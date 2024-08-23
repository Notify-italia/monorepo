import { Router } from 'express';
import { getPixelTrackerRouter } from './get.pixel';
import { postSalesCheckoutRouter } from './post.checkout';
import { postSalesContactRouter } from './post.contact';

const router = Router();

router.use('/contact', postSalesContactRouter);
router.use('/pixel', getPixelTrackerRouter);
router.use('/checkout', postSalesCheckoutRouter);

export { router as SalesRouter };
