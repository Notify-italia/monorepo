import {
  BadRequestError,
  ProfileModel,
  UserDocTypes,
  createAdvancedProfile,
  genericUserQuery,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  requestHandler(
    async (req, res) => {
      const profile = await ProfileModel.findOne({
        owner: req.currentUser._id,
      });

      const currentUser = await genericUserQuery<true, UserDocTypes>(
        req.currentUser.userType,
        {
          _id: req.currentUser._id,
        },
        true
      );

      if (!profile || !currentUser) {
        throw new BadRequestError('Utente non trovato');
      }

      //check if the user has already upgraded to v2
      if (currentUser.advancedProfile) {
        throw new BadRequestError('Profilo già aggiornato');
      }

      currentUser.advancedProfile = true;
      await currentUser.save();

      profile.advancedProfile = createAdvancedProfile(profile.toObject());

      await profile.save();

      res.status(201).send(profile);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as postProfileV2UpdateRouter };
