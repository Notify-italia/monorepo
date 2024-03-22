import {
  AGENT_VALIDATION_MESSAGES,
  AgentModel,
} from 'apps/nfc-api/src/app/models/model.agent';
import { requestHandler } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.request';
import { Router } from 'express';
import { query } from 'express-validator';
import { ProfileModel } from '../../../models/model.profile';

//boilderplate for a post request to create an agent
const router = Router();

router.delete(
  '/',
  query('id')
    .isMongoId()
    .withMessage(AGENT_VALIDATION_MESSAGES._id as string),
  requestHandler(
    async (req, res) => {
      const { id } = req.query;

      const agent = await AgentModel.deleteOne({ _id: id });
      const profile = await ProfileModel.deleteOne({ owner: id });

      res.status(200).send({ ...agent, profile });
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as deleteAgentRouter };
