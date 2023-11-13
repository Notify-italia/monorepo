import { EnumNotifyUserType } from '@notify/nfc-interfaces';
import { validateRequest } from 'apps/nfc-api/src/app/middlewares/middleware.validate-request';
import { COMPANY_VALIDATION_MESSAGES } from 'apps/nfc-api/src/app/models/model.company';
import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { userSignInValidation } from 'apps/nfc-api/src/app/services/service.validation';
import { signIn } from 'apps/nfc-api/src/app/services/users/service.signin';
import { Request, Router } from 'express';

const router = Router();

router.post(
  '/',
  ...userSignInValidation(COMPANY_VALIDATION_MESSAGES),
  validateRequest,
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
