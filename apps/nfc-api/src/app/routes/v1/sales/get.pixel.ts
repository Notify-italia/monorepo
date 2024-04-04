import { declareEnvs, requestHandler, sendEmail } from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';

const { ENABLE_PIXEL_ROUTE } = declareEnvs(['ENABLE_PIXEL_ROUTE']);

const router = Router();

router.get(
  '/',
  query('utm_source').isString(),
  requestHandler(async (req, res) => {
    const { utm_source } = req.query;

    if (ENABLE_PIXEL_ROUTE === 'true') {
      sendEmail({
        to: ['leonardo.m@notifyapp.it'],
        title: `Notify Pixel Tracker`,
        body: `
        <p>
        Una persona ha appena triggerato un pixel di tracciamento con utm_source=${utm_source}.
        </p>`,
      });
    }

    res.redirect('http://s3-api.vps.notifyapp.it/assets/Primary%20Logo.png');
  })
);

export { router as getPixelTrackerRouter };

//<img src="${endpoint}/pixel?utm_source=estra">
