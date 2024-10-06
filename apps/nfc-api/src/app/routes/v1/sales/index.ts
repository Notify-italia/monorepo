import { Router } from 'express';
import { getPixelTrackerRouter } from './get.pixel';
import { postSalesCheckoutRouter } from './post.checkout';
import { postSalesCollectRouter } from './post.collect';

const router = Router();

router.use('/collect', postSalesCollectRouter);
router.use('/pixel', getPixelTrackerRouter);
router.use('/checkout', postSalesCheckoutRouter);

export { router as SalesRouter };
