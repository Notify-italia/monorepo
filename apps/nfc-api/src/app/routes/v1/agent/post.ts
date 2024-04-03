import { EnumNotifyUserType, INotifyLicense } from '@notify/interfaces';
import { Router } from 'express';
import { body } from 'express-validator';
import { Types } from 'mongoose';
import { wLog } from '../../../../main';
import {
  AGENT_VALIDATION_MESSAGES,
  AgentModel,
} from '../../../models/model.agent';
import { PROFILE_VALIDATION_MESSAGES } from '../../../models/model.profile';
import { BadRequestError } from '../../../services/errors/errors';
import { requestHandler } from '../../../services/errors/middlewares/bun.request';
import { agentCreatedEmail } from '../../../services/service.email';
import { LicenseManager } from '../../../services/service.license';
import { userSignInValidation } from '../../../services/service.validation';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  ...userSignInValidation(AGENT_VALIDATION_MESSAGES),
  body('role')
    .isString()
    .withMessage(PROFILE_VALIDATION_MESSAGES.role as string),
  body('enabled')
    .isBoolean()
    .withMessage(AGENT_VALIDATION_MESSAGES.enabled as string),
  body('feedbackEnabled')
    .isBoolean()
    .withMessage(AGENT_VALIDATION_MESSAGES.enabled as string),
  requestHandler(
    async (req, res) => {
      //get the email, password, role, enabled, and feedbackEnabled from the request body
      const { email, password, role, enabled, feedbackEnabled } = req.body;

      //load the license for the current user
      const license = await LicenseManager.load({
        id: (req.currentUser?.license as unknown as INotifyLicense)?._id,
      });

      //get all the agents for the current user
      const companyagents = await AgentModel.find({
        owner: req.currentUser?._id,
      })
        .lean()
        .select('_id');

      if (companyagents.length >= license.license.allowedAgents) {
        //if the number of agents is greater than or equal to the allowed agents, throw an error
        throw new BadRequestError('Hai raggiunto il numero massimo di agenti');
      }

      //create a new agent with the email, password, role, enabled, and feedbackEnabled
      const agent = await AgentModel.build(
        {
          email,
          password,
          enabled,
          owner: new Types.ObjectId(req.currentUser?._id),
        },
        { role, feedbackEnabled }
      ).catch((err) => {
        wLog(err, 'error');
        throw new BadRequestError('Email già in uso');
      });

      await agent?.save();

      //send an email to the agent with the email, the current user's email, and the password
      await agentCreatedEmail(
        agent.email,
        req.currentUser?.email as string,
        password
      );

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
