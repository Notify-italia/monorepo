import { EnumNotifyUserType } from '@notify/interfaces';
import { Router } from 'express';
import { body } from 'express-validator';
import {
  COMPANY_VALIDATION_MESSAGES,
  CompanyDocument,
  CompanyModel,
} from '../../../models/model.company';
import { BadRequestError } from '../../../services/errors/errors';
import { errorHandledRequest } from '../../../services/errors/middlewares/bun.error-handler';
import { asyncForEach } from '../../../services/service.utils';
import { Password } from '../../../services/users/service.password';

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

      //for each key in the body of the request set the company key equal to the body value
      await asyncForEach(Object.keys(req.body), async (key) => {
        if (key === 'password') {
          const hasedPassword = await _validateCompanyPassword(
            company,
            req.body[key]
          );

          company.set(key, hasedPassword);
        } else {
          //if the key is not password, set the company key equal to the body value
          company.set(key, req.body[key]);
        }

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

const _validateCompanyPassword = async (
  company: CompanyDocument,
  password: string
) => {
  //check if the password is the same as the current password
  const arePasswordEqual = await Password.compare(
    company.password as string,
    password
  );

  if (arePasswordEqual) {
    throw new BadRequestError(
      'La password non può essere uguale a quella attuale'
    );
  }

  return await Password.toHash(password);
};
