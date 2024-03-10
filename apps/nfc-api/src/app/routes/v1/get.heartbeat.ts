import { requestHandler } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.request';
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
