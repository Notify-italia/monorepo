import {
  LICENSE_VALIDATION_MESSAGES,
  LicenseManager,
  requestHandler,
} from '@notify/nfc-api-core';
import { isDate } from 'date-fns';
import { Router } from 'express';
import { body, query } from 'express-validator';

const router = Router();

router.post(
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
  query('id')
    .isMongoId()
    .withMessage(LICENSE_VALIDATION_MESSAGES._id as string),
  requestHandler(
    async (req, res) => {
      const { allowedAgents, expirationDate, boughtCards } = req.body;
      const { id } = req.query;

      const license = await LicenseManager.load({
        id: id as string,
      });

      await license.patch({
        allowedAgents,
        expirationDate,
        boughtCards,
      });

      res.status(200).send(license);
    },
    {
      errorMessage: 'ERRORE!',
      requireApiKey: true,
    }
  )
);

export { router as patchLicenseRouter };
