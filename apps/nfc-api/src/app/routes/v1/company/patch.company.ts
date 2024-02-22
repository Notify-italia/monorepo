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
  body('email')
    .optional()
    .isEmail()
    .withMessage(COMPANY_VALIDATION_MESSAGES.email as string),
  errorHandledRequest(
    async (req, res) => {
      const company = await CompanyModel.findById(req.currentUser._id);

      if (!company) {
        throw new BadRequestError(COMPANY_VALIDATION_MESSAGES._id as string);
      }

      //per ogni chiave del body, setta la chiave del company uguale al valore del body
      Object.keys(req.body).forEach((key) => {
        company.set(key, req.body[key]);
        company.isModified(key);
      });

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
