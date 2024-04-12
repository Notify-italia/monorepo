import { EnumNotifyUserType } from '@notify/interfaces';
import {
  LICENSE_VALIDATION_MESSAGES,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { body } from 'express-validator';
import { Types } from 'mongoose';

import { LicenseManager } from '@notify/nfc-api-core';

const router = Router();

router.patch(
  '/',
  body('publicKey')
    .isString()
    .notEmpty()
    .withMessage(LICENSE_VALIDATION_MESSAGES.publicKey as string),
  requestHandler(
    async (req, res) => {
      const { publicKey } = req.body;

      const license = await LicenseManager.load({ publicKey });

      await license.assign(new Types.ObjectId(req.currentUser._id));

      res.status(200).send(license);
    },
    {
      requireAuth: {
        requireLicense: false,
      },
      permittedRoles: [EnumNotifyUserType.Company],
    }
  )
);

export { router as patchLicenseCompanyRouter };
