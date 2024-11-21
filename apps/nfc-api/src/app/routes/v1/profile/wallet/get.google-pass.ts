import { INotifyProfile } from '@notify/interfaces';
import {
  BadRequestError,
  declareEnvs,
  EnumAssetExtractTo,
  extractAssetFiles,
  getContactName,
  getFilenameFromUrl,
  getPathFromUrl,
  getProfileAvatar,
  getProfileFromUserId,
  getProfilePlayerUrl,
  PROFILE_VALIDATION_MESSAGES,
  queryUsers,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';
import * as GoogleWallet from 'google-wallet';
import { ViewUnlockRequirementEnum } from 'google-wallet/lib/esm/generic';
import jwt from 'jsonwebtoken';

//boilderplate for a post request to create an agent
const router = Router();

const {
  APPLE_TEAM_IDENTIFIER,
  APPLE_PASS_TYPE_IDENTIFIER,
  APPLE_ORGANIZATION_NAME,
  PLAYER_WEBSITE_URL,
  S3_BUCKET,
} = declareEnvs([
  'S3_BUCKET',
  'APPLE_TEAM_IDENTIFIER',
  'APPLE_PASS_TYPE_IDENTIFIER',
  'APPLE_ORGANIZATION_NAME',
  'PLAYER_WEBSITE_URL',
]);

/** Each, but last, can be either a string or a Buffer. See API Documentation for more */
const { googleCredentials, logo, passJson, icon, icon2x, logo2x, background } =
  await extractAssetFiles([
    {
      path: 'certs/google/application-credentials.json',
      id: 'googleCredentials',
      extractTo: EnumAssetExtractTo.String,
    },
    {
      path: 'pkpasses/notifyProfile.pass/logo.png',
      id: 'logo',
      extractTo: EnumAssetExtractTo.Buffer,
    },
    {
      path: 'pkpasses/notifyProfile.pass/logo@2x.png',
      id: 'logo2x',
      extractTo: EnumAssetExtractTo.Buffer,
    },
    {
      path: 'pkpasses/notifyProfile.pass/pass.json',
      id: 'passJson',
      extractTo: EnumAssetExtractTo.String,
    },
    {
      path: 'pkpasses/notifyProfile.pass/icon.png',
      id: 'icon',
      extractTo: EnumAssetExtractTo.Buffer,
    },
    {
      path: 'pkpasses/notifyProfile.pass/icon@2x.png',
      id: 'icon2x',
      extractTo: EnumAssetExtractTo.Buffer,
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

      const generic = new GoogleWallet.GenericClient(credentials);

      const passs = generic.createClass({
        id: `3388000000022798677.${profile._id}`,
        enableSmartTap: false,
        classTemplateInfo: {},
        linksModuleData: {
          uris: [
            {
              uri: getProfilePlayerUrl(profile, PLAYER_WEBSITE_URL),
              description: `Il profilo Notify di ${getContactName(profile)}`,
            },
          ],
        },
        viewUnlockRequirement: ViewUnlockRequirementEnum.UNLOCK_NOT_REQUIRED,
      });

      const token = jwt.sign(
        {
          iss: credentials.client_email,
          aud: 'google',
          oridins: ['https://wallet.google.com'],
          typ: 'savetowallet',
          payload: {
            genericClasses: [passs],
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

/**
 * Rounds the corners of the provided profile's avatar
 */
const _getThumbnail = async (profile: INotifyProfile, size: number) => {
  const _s3Url = getProfileAvatar(profile);

  if (!_s3Url?.length) {
    return new ArrayBuffer(0);
  }

  const s3Path = `${getPathFromUrl(_s3Url)}/${getFilenameFromUrl(_s3Url)}`;

  return await fetch(
    `https://${S3_BUCKET}.imgix.net${s3Path}?w=${size}&h=${size}&corner-radius=5%2C5%2C5%2C5&mask=corners&fm=png&auto=format&fit=crop&ixlib=js-2.0.0&s=e62ba672dfe60e2fd7131f0e31ca26a3`
  ).then(async (res) => await res.arrayBuffer());
};
