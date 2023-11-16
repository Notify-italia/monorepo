import { EnumNotifyUserType } from '@notify/notify-interfaces';
import { AGENT_VALIDATION_MESSAGES } from '../../../models/model.agent';
import { errorHandledRequest } from '../../../services/errors/middlewares/bun.error-handler';

import { Request, Router } from 'express';
import { userSignInValidation } from '../../../services/service.validation';
import { signIn } from '../../../services/users/service.signin';

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
