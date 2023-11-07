import { validateRequest } from 'apps/nfc-api/src/app/middlewares/middleware.validate-request';
import { COMPANY_VALIDATION_MESSAGES } from 'apps/nfc-api/src/app/models/model.company';
import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { EnumTargetDb } from 'apps/nfc-api/src/app/services/service.db';
import { signIn } from 'apps/nfc-api/src/app/services/users/service.signin';
import { userSignInValidation } from 'apps/nfc-api/src/app/services/users/service.validation';
import { Request, Router } from 'express';

const router = Router();

router.post(
  '/',
  ...userSignInValidation(COMPANY_VALIDATION_MESSAGES),
  validateRequest,
  errorHandledRequest(
    async (req: Request<{ email: string; password: string }>, res) => {
      const { email, password } = req.body;

      const user = await signIn({ email, password }, EnumTargetDb.Company);

      res.status(200).send(user);
    }
  )
);

export { router as postSigninCompanyRouter };
