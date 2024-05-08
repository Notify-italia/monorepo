import { ProfileModel, requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';
import { body } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  body('profileIdentifier').toLowerCase(),
  requestHandler(
    async (req, res) => {
      const { profileIdentifier } = req.body;

      const profile = await ProfileModel.findOne({
        profileIdentifier,
      })
        .lean()
        .select('_id');

      if (profile) {
        res.send({ available: false });
        return;
      }

      res.status(200).send({ available: true });
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as postCheckProfileIdentifierRouter };
