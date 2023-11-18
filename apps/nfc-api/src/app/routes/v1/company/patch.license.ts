import { EnumNotifyUserType } from '@notify/interfaces';
import { Router } from 'express';
import { body } from 'express-validator';
import { Types } from 'mongoose';
import { LICENSE_VALIDATION_MESSAGES } from '../../../models/model.license';
import { errorHandledRequest } from '../../../services/errors/middlewares/bun.error-handler';
import { LicenseManager } from '../../../services/service.license';

const router = Router();

router.patch(
  '/',
  body('publicKey')
    .isString()
    .notEmpty()
    .withMessage(LICENSE_VALIDATION_MESSAGES.publicKey as string),
  errorHandledRequest(
    async (req, res) => {
      const { publicKey } = req.body;

      const license = await LicenseManager.find(publicKey);

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
