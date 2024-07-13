import {
  AgentModel,
  BadRequestError,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.delete(
  '/',
  query('token').isString().withMessage('Token is required'),
  requestHandler(
    async (req, res) => {
      const { _id } = req.currentUser;
      const { token } = req.query as { token: string };

      const agent = await AgentModel.findById(_id);

      if (!agent) {
        throw new BadRequestError('Agent not found');
      }

      if (!agent.fcmTokens.includes(token)) {
        res.status(304).send(agent);
        return;
      }

      agent.fcmTokens = agent.fcmTokens.filter((t) => t !== token);

      await agent.save();

      res.send(agent);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as deleteFcmAgentRouter };
