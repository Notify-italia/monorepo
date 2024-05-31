import { EnumNotifyUserType } from '@notify/interfaces';
import {
  AGENT_VALIDATION_MESSAGES,
  AgentModel,
  BadRequestError,
  PROFILE_VALIDATION_MESSAGES,
  Password,
  ProfileModel,
  requestHandler,
  userSignInValidation,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { body, query } from 'express-validator';

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
        //if the current user is an agent and the current user id is not equal to the id in the query, throw an error
        throw new BadRequestError(
          'You are not authorized to perform this action'
        );
      }

      //get the agent by its id
      const agent = await AgentModel.findById(id);

      if (!agent) {
        //if the agent is not found, throw an error
        throw new BadRequestError('Agent not found');
      }

      //update the agent with the email, password, role, enabled, and savedRedirects
      agent.email = email ?? agent.email;
      agent.password = password
        ? await Password.toHash(password)
        : agent.password;

      if (EnumNotifyUserType.Company === req.currentUser.userType) {
        //if the current user type is a company, update the role and enabled
        agent.enabled = enabled ?? agent.enabled;

        console.log('updating role', role);
        if (role !== undefined && role !== null) {
          await ProfileModel.updateOne({ owner: agent._id }, { role });
        }
      }

      //update the savedRedirects
      agent.savedRedirects = savedRedirects ?? agent.savedRedirects;

      if (feedbackEnabled !== undefined) {
        //if feedbackEnabled is not undefined, update the feedbackEnabled
        //* feedbackEnabled is a boolean value that determines if the agent can receive feedback
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
