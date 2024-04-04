import { EnumNotifyUserType } from '@notify/interfaces';
import { COMPANY_VALIDATION_MESSAGES } from '@notify/nfc-api-core';
import { Request, Router } from 'express';
import { requestHandler } from '../../../services/errors/middlewares/bun.request';
import { userSignInValidation } from '../../../services/service.validation';
import { signIn } from '../../../services/users/service.signin';

const router = Router();

router.post(
  '/',
  ...userSignInValidation(COMPANY_VALIDATION_MESSAGES),
  requestHandler(
    async (req: Request<{ email: string; password: string }>, res) => {
      const { email, password } = req.body;

      const signedInUser = await signIn(
        { email, password },
        EnumNotifyUserType.Company,
        'license'
      );

      res.status(200).send(signedInUser);
    }
  )
);

export { router as postSigninCompanyRouter };
