import { getProfile, requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';
import multer from 'multer';

//boilderplate for a post request to create an agent
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  requestHandler(
    async (req, res) => {
      const profile = await getProfile(req.currentUser._id);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as postPkpassRouter };
