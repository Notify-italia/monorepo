import { Router } from 'express';
import { body } from 'express-validator';
import { LICENSE_VALIDATION_MESSAGES } from '../../../models/model.license';
import { errorHandledRequest } from '../../../services/errors/middlewares/bun.error-handler';
import { LicenseManager } from '../../../services/service.license';

const router = Router();

router.patch(
  '/',
  body('allowedAgents')
    .isNumeric()
    .custom((value) => value > 0)
    .withMessage(LICENSE_VALIDATION_MESSAGES.allowedAgents as string),
  body('expirationDate')
    .isISO8601()
    .withMessage(LICENSE_VALIDATION_MESSAGES.expirationDate as string),
  body('APIKey')
    .custom((v) => v === Bun.env['API_KEY'])
    .notEmpty()
    .withMessage('invalid APIKey'),
  errorHandledRequest(async (req, res) => {
    const { allowedAgents, expirationDate } = req.body;

    const license = await LicenseManager.generate({
      allowedAgents,
      expirationDate,
    });

    res.status(200).send(license);
  }, {})
);

export { router as postLicenseCompanyRouter };
