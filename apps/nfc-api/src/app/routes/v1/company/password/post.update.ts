import { EnumNotifyUserType } from '@notify/interfaces';
import { BadRequestError } from 'apps/nfc-api/src/app/services/errors/errors';
import { Password } from 'apps/nfc-api/src/app/services/users/service.password';
import { Router } from 'express';
import { body } from 'express-validator';
import {
  CompanyDocument,
  CompanyModel,
} from '../../../../models/model.company';
import { LICENSE_VALIDATION_MESSAGES } from '../../../../models/model.license';
import { errorHandledRequest } from '../../../../services/errors/middlewares/bun.error-handler';
import {
  INVALID_JWT_TOKEN,
  verifyToken,
} from '../../../../services/service.jwt';
import { userSignInValidation } from '../../../../services/service.validation';

const router = Router();

router.post(
  '/',
  userSignInValidation(LICENSE_VALIDATION_MESSAGES, true, false),
  body('token').isJWT().withMessage(INVALID_JWT_TOKEN),
  errorHandledRequest(
    async (req, res) => {
      const { password, token } = req.body;

      const validatedToken = verifyToken<{
        email: string;
        id: string;
      }>(token);

      const company = await CompanyModel.findOne({
        email: validatedToken.email,
        _id: validatedToken.id,
      });

      if (!company) {
        throw new BadRequestError('Utente non trovato');
      }

      const hashedPassword = await _validateCompanyPassword(company, password);

      company.password = hashedPassword;
      await company.save();

      res.send({ status: 'ok' });
    },
    {
      requireAuth: {
        requireLicense: false,
      },
      permittedRoles: [EnumNotifyUserType.Company],
    }
  )
);

export { router as postCompanyPasswordUpdateRouter };

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
