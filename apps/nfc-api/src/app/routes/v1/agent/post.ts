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
import { errorHandledRequest } from '../../../services/errors/middlewares/bun.error-handler';
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
  errorHandledRequest(
    async (req, res) => {
      const { email, password, role, enabled, feedbackEnabled } = req.body;

      //TODO check se la company può ancora creare agenti

      const license = await LicenseManager.load({
        id: (req.currentUser?.license as unknown as INotifyLicense)?._id,
      });

      const companyagents = await AgentModel.find({
        owner: req.currentUser?._id,
      })
        .lean()
        .select('_id');

      if (license.license.allowedAgents === companyagents.length) {
        throw new BadRequestError('Hai raggiunto il numero massimo di agenti');
      }

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

      //TODO send email to agent

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
