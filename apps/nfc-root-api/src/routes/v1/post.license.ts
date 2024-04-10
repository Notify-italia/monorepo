import {
  LICENSE_VALIDATION_MESSAGES,
  LicenseManager,
  requestHandler,
} from '@notify/nfc-api-core';
import { isDate } from 'date-fns';
import { Router } from 'express';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/',
  body('allowedAgents')
    .custom((value) => value === null || (!isNaN(value) && value > 0))
    .withMessage(LICENSE_VALIDATION_MESSAGES.allowedAgents as string),
  body('expirationDate')
    .custom((value) => value === null || isDate(new Date(value)))
    .withMessage(LICENSE_VALIDATION_MESSAGES.expirationDate as string),
  body('boughtCards')
    .custom((value) => !isNaN(value) && value >= 0)
    .withMessage(LICENSE_VALIDATION_MESSAGES.boughtCards as string),
  requestHandler(
    async (req, res) => {
      const { allowedAgents, expirationDate, boughtCards } = req.body;

      const { license } = await LicenseManager.generate({
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

export { router as postLicenseRouter };
