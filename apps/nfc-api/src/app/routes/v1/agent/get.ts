import {
  AGENT_VALIDATION_MESSAGES,
  AgentModel,
} from 'apps/nfc-api/src/app/models/model.agent';
import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('id')
    .optional()
    .isMongoId()
    .withMessage(AGENT_VALIDATION_MESSAGES._id as string),
  errorHandledRequest(
    async (req, res) => {
      const { id } = req.query;

      if (id) {
        res.status(200).send(await AgentModel.findById(id).lean());
        return;
      }

      //TODO gestire meglio questa chiamata a livello di pulizia del codice
      const owner = req.currentUser._id || req.currentUser.owner;
      res
        .status(200)
        .send(await AgentModel.find({ owner }).populate('profile').lean());
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as getAgentRouter };
