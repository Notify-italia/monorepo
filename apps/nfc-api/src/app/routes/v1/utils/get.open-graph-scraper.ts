import { BadRequestError, requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';
import ogScraper from 'open-graph-scraper';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('url').optional().isURL().withMessage(`URL non valido`),
  requestHandler(async (req, res) => {
    const { url } = req.query;

    if (!url) {
      throw new BadRequestError('URL non fornito');
    }

    const data = await ogScraper({
      url: url as string,
    });

    res.send(data);
  })
);

export { router as getOpenGraphScraperRouter };
