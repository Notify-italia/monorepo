import { EnumNotifyUserType } from '@notify/nfc-interfaces';
import { Request, Router } from 'express';
import { COMPANY_VALIDATION_MESSAGES } from '../../../models/model.company';
import { errorHandledRequest } from '../../../services/errors/middlewares/bun.error-handler';
import { userSignInValidation } from '../../../services/service.validation';
import { signIn } from '../../../services/users/service.signin';

const router = Router();

router.post(
  '/',
  ...userSignInValidation(COMPANY_VALIDATION_MESSAGES),
  errorHandledRequest(
    async (req: Request<{ email: string; password: string }>, res) => {
      const { email, password } = req.body;

      const user = await signIn(
        { email, password },
        EnumNotifyUserType.Company
      );

      res.status(200).send(user);
    }
  )
);

export { router as postSigninCompanyRouter };
