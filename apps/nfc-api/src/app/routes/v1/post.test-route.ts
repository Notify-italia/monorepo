import { requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  requestHandler(async (req, res) => {
    res.status(201).json({ message: 'Notification created' });
  }, {})
);

export { router as postTestRouter };
