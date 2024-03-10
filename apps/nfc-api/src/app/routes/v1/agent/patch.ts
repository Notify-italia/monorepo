import { EnumNotifyUserType } from '@notify/interfaces';
import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  AGENT_VALIDATION_MESSAGES,
  AgentModel,
} from '../../../models/model.agent';
import {
  PROFILE_VALIDATION_MESSAGES,
  ProfileModel,
} from '../../../models/model.profile';
import { BadRequestError } from '../../../services/errors/errors';
import { requestHandler } from '../../../services/errors/middlewares/bun.request';
import { userSignInValidation } from '../../../services/service.validation';
import { Password } from '../../../services/users/service.password';

//boilderplate for a post request to create an agent
const router = Router();

router.patch(
  '/',
  ...userSignInValidation(AGENT_VALIDATION_MESSAGES, false, false),
  query('id')
    .isMongoId()
    .withMessage(AGENT_VALIDATION_MESSAGES._id as string),
  body('role')
    .optional()
    .isString()
    .withMessage(PROFILE_VALIDATION_MESSAGES.role as string),
  body('enabled')
    .optional()
    .isBoolean()
    .withMessage(AGENT_VALIDATION_MESSAGES.enabled as string),
  body('feedbackEnabled')
    .optional()
    .isBoolean()
    .withMessage(AGENT_VALIDATION_MESSAGES.enabled as string),
  body('savedRedirects')
    .optional()
    .isArray()
    .withMessage(AGENT_VALIDATION_MESSAGES.savedRedirects as string),

  requestHandler(
    async (req, res) => {
      const { id } = req.query;
      const {
        email,
        password,
        role,
        enabled,
        savedRedirects,
        feedbackEnabled,
      } = req.body;

      if (
        req.currentUser.userType === EnumNotifyUserType.Agent &&
        req.currentUser._id !== id
      ) {
        throw new BadRequestError(
          'You are not authorized to perform this action'
        );
      }

      const agent = await AgentModel.findById(id);

      if (!agent) {
        throw new BadRequestError('Agent not found');
      }

      agent.email = email ?? agent.email;
      agent.password = password
        ? await Password.toHash(password)
        : agent.password;

      if (EnumNotifyUserType.Company === req.currentUser.userType) {
        agent.enabled = enabled ?? agent.enabled;
      }

      agent.savedRedirects = savedRedirects ?? agent.savedRedirects;

      if (role) {
        await ProfileModel.updateOne({ owner: agent._id }, { role });
      }

      if (feedbackEnabled !== undefined) {
        await ProfileModel.updateOne(
          { owner: agent._id },
          { $set: { 'config.feedbackEnabled': feedbackEnabled } }
        );
      }

      await agent.save();

      res.status(201).send(agent);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as patchAgentRouter };
