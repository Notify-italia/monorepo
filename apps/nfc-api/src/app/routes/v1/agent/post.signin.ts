import { EnumNotifyUserType } from '@notify/nfc-interfaces';
import { AGENT_VALIDATION_MESSAGES } from 'apps/nfc-api/src/app/models/model.agent';
import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';

import { userSignInValidation } from 'apps/nfc-api/src/app/services/service.validation';
import { signIn } from 'apps/nfc-api/src/app/services/users/service.signin';
import { Request, Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  ...userSignInValidation(AGENT_VALIDATION_MESSAGES),

  errorHandledRequest(
    async (req: Request<{ email: string; password: string }>, res) => {
      const { email, password } = req.body;

      const user = await signIn({ email, password }, EnumNotifyUserType.Agent);

      res.status(200).send(user);
    }
  )
);

export { router as postSigninAgentRouter };
