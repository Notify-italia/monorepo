import {
  IGoogleGenericPassNotifyProfile,
  INotifyProfile,
  INotifyUser,
  UnknownType,
} from '@notify/interfaces';
import {
  BadRequestError,
  declareEnvs,
  EnumAssetExtractTo,
  extractAssetFiles,
  getContactName,
  getProfileFromUserId,
  getProfilePlayerUrl,
  PROFILE_VALIDATION_MESSAGES,
  queryUsers,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';
import { GenericClient } from 'google-wallet';
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
    path: 'certs/google/notify-wallet-credentials.json',
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

      const pass = await _fetchWallet(profile, user, credentials);

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

const _fetchWallet = async (
  profile: INotifyProfile,
  user: INotifyUser,
  credentials: UnknownType
): Promise<IGoogleGenericPassNotifyProfile> => {
  const generic = new GenericClient(credentials);

  const _pass = JSON.parse(notifyProfile as string);

  _pass.id = `${GOOGLE_ISSUER_ID}.${profile._id}`;
  _pass.classId = `${GOOGLE_ISSUER_ID}.${profile._id}`;
  // _pass.logo.sourceUri.uri = getProfileAvatar(profile);
  _pass.cardTitle.defaultValue.value = 'Notify';
  _pass.subheader.defaultValue.value = user.email;
  _pass.header.defaultValue.value = getContactName(profile);

  if (!_pass.header.defaultValue.value.trim().length) {
    throw new BadRequestError(
      'Per poter creare il pass è necessario inserire un nome nel profilo'
    );
  }

  _pass.barcode.value = getProfilePlayerUrl(profile, PLAYER_WEBSITE_URL);
  _pass.heroImage = undefined;

  let genericObject = await generic
    .getObject(GOOGLE_ISSUER_ID, profile._id)
    .catch(
      (e) => new BadRequestError(`ERROR WHILE FETCHING GOOGLE PASS: ${e}`)
    );

  if (!genericObject) {
    await generic
      .createClass({
        id: `${GOOGLE_ISSUER_ID}.${profile._id}`,
      })
      .catch((e) =>
        console.warn(
          `error while creating class, probabily already exists: ${e}`
        )
      );
    genericObject = await generic.createObject(_pass);
  }

  await generic
    .patchObject(_pass)
    .catch(
      (e) => new BadRequestError(`ERROR WHILE PATCHING GOOGLE PASS: ${e}`)
    );

  return genericObject as IGoogleGenericPassNotifyProfile;
};
