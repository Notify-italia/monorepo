import { validateRequest } from 'apps/nfc-api/src/app/middlewares/middleware.validate-request';
import {
  AGENT_VALIDATION_MESSAGES,
  AgentModel,
} from 'apps/nfc-api/src/app/models/model.agent';
import { BadRequestError } from 'apps/nfc-api/src/app/services/errors/errors';
import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { userSignInValidation } from 'apps/nfc-api/src/app/services/users/service.validation';
import { wLog } from 'apps/nfc-api/src/main';
import { Request, Router } from 'express';
import { Types } from 'mongoose';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  ...userSignInValidation(AGENT_VALIDATION_MESSAGES),
  validateRequest,
  errorHandledRequest(
    async (req: Request<{ email: string; password: string }>, res) => {
      const { email, password } = req.body;

      const agent = await AgentModel.build(
        { email, password },
        //TODO associa l'agent alla company attraverso il valore nel token
        '' as unknown as Types.ObjectId
      ).catch((err) => {
        wLog(err, 'error');
        throw new BadRequestError('Email già in uso');
      });

      await agent?.save();

      //todo invia email di conferma

      res.status(201).send(agent);
    }
  )
);

export { router as postAgentRouter };
