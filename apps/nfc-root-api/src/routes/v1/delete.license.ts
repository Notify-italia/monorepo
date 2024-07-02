import {
  BadRequestError,
  CompanyModel,
  LICENSE_VALIDATION_MESSAGES,
  LicenseManager,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';

const router = Router();

router.delete(
  '/',
  query('id')
    .isMongoId()
    .withMessage(LICENSE_VALIDATION_MESSAGES._id as string),
  requestHandler(
    async (req, res) => {
      const id = req.query.id as string;

      const instance = await LicenseManager.load({ id });

      const hasCompany = await CompanyModel.findOne({
        licenses: instance.value._id,
      });

      console.log('hasCompany', hasCompany);

      if (hasCompany) {
        throw new BadRequestError(
          'Cannot delete a license that is still associated with a company'
        );
      }

      await instance.delete();

      res.status(200).send(instance.value);
    },
    {
      errorMessage: 'ERRORE!',
      requireApiKey: true,
    }
  )
);

export { router as deleteLicenseRouter };
