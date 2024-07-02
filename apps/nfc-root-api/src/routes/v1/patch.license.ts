import {
  LICENSE_VALIDATION_MESSAGES,
  LicenseManager,
  requestHandler,
} from '@notify/nfc-api-core';
import { isDate } from 'date-fns';
import { Router } from 'express';
import { body, query } from 'express-validator';

const router = Router();

router.patch(
  '/',
  body('allowedAgents')
    .optional()
    .custom((value) => value === null || (!isNaN(value) && value > 0))
    .withMessage(LICENSE_VALIDATION_MESSAGES.allowedAgents as string),
  body('expirationDate')
    .optional()
    .custom((value) => value === null || isDate(new Date(value)))
    .withMessage(LICENSE_VALIDATION_MESSAGES.expirationDate as string),
  body('boughtCards')
    .optional()
    .custom((value) => !isNaN(value) && value >= 0)
    .withMessage(LICENSE_VALIDATION_MESSAGES.boughtCards as string),
  body('enabled')
    .optional()
    .isBoolean()
    .withMessage(LICENSE_VALIDATION_MESSAGES.enabled as string),
  body('features')
    .optional()
    .isArray()
    .withMessage(LICENSE_VALIDATION_MESSAGES.features as string),
  query('id')
    .isMongoId()
    .withMessage(LICENSE_VALIDATION_MESSAGES._id as string),
  requestHandler(
    async (req, res) => {
      const { allowedAgents, expirationDate, boughtCards, enabled, features } =
        req.body;
      const { id } = req.query;

      const license = await LicenseManager.load({
        id: id as string,
        ignoreDisabled: true,
      });

      await license.patch({
        allowedAgents,
        expirationDate,
        boughtCards,
        enabled,
        features,
      });

      res.status(200).send(license.value);
    },
    {
      errorMessage: 'ERRORE!',
      requireApiKey: true,
    }
  )
);

export { router as patchLicenseRouter };
