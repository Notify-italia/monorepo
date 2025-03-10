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
  body('features').isArray().withMessage('features must be an array'),
  body('quantity')
    .custom((value) => !isNaN(value) && value >= 0)
    .withMessage('quantity must be a number'),
  requestHandler(
    async (req, res) => {
      const { allowedAgents, expirationDate, boughtCards, features, quantity } =
        req.body;

      const licenses = await LicenseManager.generate(
        {
          allowedAgents,
          expirationDate,
          boughtCards,
          features,
        },
        quantity
      );

      res.status(200).send(licenses.map((l) => l.value));
    },
    {
      errorMessage: 'ERRORE!',
      requireApiKey: true,
    }
  )
);

export { router as postLicenseRouter };
