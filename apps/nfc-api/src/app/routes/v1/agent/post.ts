import { EnumNotifyUserType } from '@notify/interfaces';
import { Request, Router } from 'express';
import { Types } from 'mongoose';
import { wLog } from '../../../../main';
import {
  AGENT_VALIDATION_MESSAGES,
  AgentModel,
} from '../../../models/model.agent';
import { BadRequestError } from '../../../services/errors/errors';
import { errorHandledRequest } from '../../../services/errors/middlewares/bun.error-handler';
import { userSignInValidation } from '../../../services/service.validation';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  ...userSignInValidation(AGENT_VALIDATION_MESSAGES),
  errorHandledRequest(
    async (req: Request<{ email: string; password: string }>, res) => {
      const { email, password, role, enabled } = req.body;

      console.log('req.body', req.body);

      const agent = await AgentModel.build(
        { email, password, enabled },
        new Types.ObjectId(req.currentUser?._id),
        { role }
      ).catch((err) => {
        wLog(err, 'error');
        throw new BadRequestError('Email già in uso');
      });

      await agent?.save();

      //todo invia email di conferma

      res.status(201).send(agent);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
      permittedRoles: [EnumNotifyUserType.Company],
    }
  )
);

export { router as postAgentRouter };
