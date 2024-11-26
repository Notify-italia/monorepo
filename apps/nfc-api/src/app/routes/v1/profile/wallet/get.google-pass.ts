import {
  IGoogleGenericPassNotifyProfile,
  INotifyProfile,
  INotifyUser,
} from '@notify/interfaces';
import {
  BadRequestError,
  declareEnvs,
  EnumAssetExtractTo,
  extractAssetFiles,
  getContactName,
  getProfileAvatar,
  getProfileFromUserId,
  getProfilePlayerUrl,
  PROFILE_VALIDATION_MESSAGES,
  queryUsers,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';
import jwt from 'jsonwebtoken';

//boilderplate for a post request to create an agent
const router = Router();

const { PLAYER_WEBSITE_URL, GOOGLE_ISSUER_ID } = declareEnvs([
  'PLAYER_WEBSITE_URL',
  'GOOGLE_ISSUER_ID',
]);

/** Each, but last, can be either a string or a Buffer. See API Documentation for more */
const { googleCredentials, notifyProfile } = await extractAssetFiles([
  {
    path: 'certs/google/application-credentials.json',
    id: 'googleCredentials',
    extractTo: EnumAssetExtractTo.String,
  },
  {
    path: 'google-passes/notifyProfile.json',
    id: 'notifyProfile',
    extractTo: EnumAssetExtractTo.String,
  },
]);

router.get(
  '/',
  query('profile')
    .isMongoId()
    .withMessage(PROFILE_VALIDATION_MESSAGES._id as string),
  requestHandler(
    async (req, res) => {
      const profile = await getProfileFromUserId(req.currentUser._id);
      const user = await queryUsers(
        {
          _id: profile?.owner,
        },
        true
      );
      if (!profile || !user) {
        throw new BadRequestError('Profilo non trovato');
      }

      const credentials = JSON.parse(googleCredentials as string);

      // const generic = new GoogleWallet.GenericClient(credentials);

      // const pass = await _fetchWallet(profile, generic);

      const pass = _fetchWallet(profile, user);

      const token = jwt.sign(
        {
          iss: credentials.client_email,
          aud: 'google',
          typ: 'savetowallet',
          origins: [],
          payload: {
            genericObjects: [pass],
            genericClasses: [
              {
                id: `${GOOGLE_ISSUER_ID}.${profile._id}`,
              },
            ],
          },
        },
        credentials.private_key,
        { algorithm: 'RS256' }
      );

      res.send({
        passUrl: `https://pay.google.com/gp/v/save/${token}`,
      });
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as getGooglePassRouter };

const _fetchWallet = (
  profile: INotifyProfile,
  user: INotifyUser
): IGoogleGenericPassNotifyProfile => {
  const pass = JSON.parse(notifyProfile as string);

  pass.id = `${GOOGLE_ISSUER_ID}.${profile._id}`;
  pass.logo.sourceUri.uri = getProfileAvatar(profile);
  pass.classId = `${GOOGLE_ISSUER_ID}.${profile._id}`;
  pass.cardTitle.defaultValue.value = getContactName(profile);
  pass.header.defaultValue.value = user.email;
  pass.barcode.value = getProfilePlayerUrl(profile, PLAYER_WEBSITE_URL);

  return pass;
};
