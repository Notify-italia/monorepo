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

import { PKPass } from 'passkit-generator';

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
const { wwdr, signerCert, signerKey, logo, passJson, icon, icon2x, logo2x } =
  await extractAssetFiles([
    {
      id: 'wwdr',
      extractTo: EnumAssetExtractTo.String,
      path: 'certs/apple/wwdr.pem',
    },
    {
      path: 'certs/apple/signerCert.pem',
      id: 'signerCert',
      extractTo: EnumAssetExtractTo.String,
    },
    {
      path: 'certs/apple/signerKey.key',
      id: 'signerKey',
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

      //arrotondo i bordi dell'immagine
      const thumbnail = await _getThumbnail(profile, 80);
      const thumbnail2x = await _getThumbnail(profile, 160);

      const pass = new PKPass(
        {
          'thumbnail.png': Buffer.from(thumbnail),
          'thumbnail@2x.png': Buffer.from(thumbnail2x),
          'logo.png': Buffer.from(logo),
          'logo@2x.png': Buffer.from(logo2x),
          'pass.json': passJson as Buffer,
          'icon.png': Buffer.from(icon),
          'icon@2x.png': Buffer.from(icon2x),
        },
        {
          wwdr,
          signerCert,
          signerKey,
        },
        {
          // keys to be added or overridden
          passTypeIdentifier: APPLE_PASS_TYPE_IDENTIFIER,
          serialNumber: profile?._id.toString(),
          teamIdentifier: APPLE_TEAM_IDENTIFIER,
          organizationName: APPLE_ORGANIZATION_NAME,
        }
      );

      pass.primaryFields[0].value = getContactName(profile);
      pass.secondaryFields[0].value = user.email || 'unknown email';
      pass.setBarcodes(getProfilePlayerUrl(profile, PLAYER_WEBSITE_URL));

      res.send({
        base64: pass.getAsBuffer().toString('base64'),
      });
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as getPkpassRouter };

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
