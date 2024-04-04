import { requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  requestHandler(async (req, res) => {
    res.send('OK');
  }, {})
);

export { router as getHeartbeatRouter };
