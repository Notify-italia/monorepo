import {
  declareEnvs,
  extractAssetFiles,
  getProfileFromUserId,
  PROFILE_VALIDATION_MESSAGES,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';
import { PKPass } from 'passkit-generator';

//boilderplate for a post request to create an agent
const router = Router();

const { ASSETS_PATH } = declareEnvs(['ASSETS_PATH']);

/** Each, but last, can be either a string or a Buffer. See API Documentation for more */
const { wwdr, signerCert, signerKey } = await extractAssetFiles([
  {
    id: 'wwdr',
    extraction: 'string',
    path: 'certs/apple/wwdr.pem',
  },
  {
    path: 'certs/apple/signerCert.pem',
    id: 'signerCert',
    extraction: 'string',
  },
  {
    path: 'certs/apple/signerKey.key',
    id: 'signerKey',
    extraction: 'string',
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

      const pass = await PKPass.from(
        {
          /**
           * Note: .pass extension is enforced when reading a
           * model from FS, even if not specified here below
           */
          model: `${ASSETS_PATH}/pkpasses/examples/examplePass.pass`,
          certificates: {
            wwdr,
            signerCert,
            signerKey,
          },
        },
        {
          // keys to be added or overridden
          serialNumber: profile?._id.toString(),
        }
      );

      // Adding some settings to be written inside pass.json
      // pass.localize("it", { ... });
      pass.setBarcodes('36478105430'); // Random value

      // or

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
