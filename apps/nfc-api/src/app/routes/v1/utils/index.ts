import { Router } from 'express';
import { getOpenGraphScraperRouter } from './get.open-graph-scraper';

const router = Router();

router.use('/open-graph-scraper', getOpenGraphScraperRouter);

export { router as utilsRouter };
