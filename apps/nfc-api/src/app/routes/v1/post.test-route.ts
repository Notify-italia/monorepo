import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  errorHandledRequest(async (req, res) => {
    res.send('Hello World');
  }, {})
);

export { router as postTestRouter };
