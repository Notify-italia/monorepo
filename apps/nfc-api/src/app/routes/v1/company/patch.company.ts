import { EnumNotifyUserType } from '@notify/interfaces';
import { Router } from 'express';
import { body } from 'express-validator';
import {
  COMPANY_VALIDATION_MESSAGES,
  CompanyModel,
} from '../../../models/model.company';
import { BadRequestError } from '../../../services/errors/errors';
import { errorHandledRequest } from '../../../services/errors/middlewares/bun.error-handler';

const router = Router();

router.patch(
  '/',
  body('savedRedirects')
    .optional()
    .isArray()
    .withMessage(COMPANY_VALIDATION_MESSAGES.savedRedirects as string),
  body('createdRoles')
    .optional()
    .isArray()
    .withMessage(COMPANY_VALIDATION_MESSAGES.createdRoles as string),
  errorHandledRequest(
    async (req, res) => {
      const { createdRoles, savedRedirects } = req.body;

      const company = await CompanyModel.findById(req.currentUser._id);

      if (!company) {
        throw new BadRequestError(COMPANY_VALIDATION_MESSAGES._id as string);
      }

      company.createdRoles = createdRoles ?? company.createdRoles;
      company.savedRedirects = savedRedirects ?? company.savedRedirects;

      await company.save();

      res.status(200).send(company);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
      permittedRoles: [EnumNotifyUserType.Company],
    }
  )
);

export { router as patchCompanyRouter };
