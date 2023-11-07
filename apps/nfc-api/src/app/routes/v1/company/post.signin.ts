import { validateRequest } from 'apps/nfc-api/src/middlewares/middleware.validate-request';
import { COMPANY_VALIDATION_MESSAGES } from 'apps/nfc-api/src/models/model.company';
import { errorHandledRequest } from 'apps/nfc-api/src/services/errors/middlewares/bun.error-handler';
import { EnumTargetDb } from 'apps/nfc-api/src/services/service.db';
import { signIn } from 'apps/nfc-api/src/services/users/service.signin';
import { userSignInValidation } from 'apps/nfc-api/src/services/users/service.validation';
import { Request, Router } from 'express';

//boilderplate for a post request to create an agent
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
