import { EnumNotifyUserType } from '@notify/interfaces';
import { AGENT_VALIDATION_MESSAGES } from '@notify/nfc-api-core';
import { requestHandler } from '../../../services/errors/middlewares/bun.request';

import { Request, Router } from 'express';
import { userSignInValidation } from '../../../services/service.validation';
import { signIn } from '../../../services/users/service.signin';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  ...userSignInValidation(AGENT_VALIDATION_MESSAGES),
  requestHandler(
    async (req: Request<{ email: string; password: string }>, res) => {
      //get the email, password from the request body
      const { email, password } = req.body;

      //sign in the user with the email and password
      const user = await signIn({ email, password }, EnumNotifyUserType.Agent);

      //send the user to the client
      res.status(200).send(user);
    }
  )
);

export { router as postSigninAgentRouter };
