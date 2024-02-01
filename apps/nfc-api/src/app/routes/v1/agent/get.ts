import { EnumNotifyUserType, INotifyUser } from '@notify/interfaces';
import {
  AGENT_VALIDATION_MESSAGES,
  AgentModel,
} from 'apps/nfc-api/src/app/models/model.agent';
import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { Router } from 'express';
import { query } from 'express-validator';
import { isValidObjectId } from 'mongoose';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('id')
    .optional()
    .custom((value) =>
      value.split(',').every((id: string) => isValidObjectId(id))
    )
    .withMessage(AGENT_VALIDATION_MESSAGES._id as string),
  errorHandledRequest(
    async (req, res) => {
      const { id } = req.query;

      if (id) {
        res.status(200).send(
          await AgentModel.find({ _id: (id as string).split(',') })
            .populate('profile')
            .lean()
        );
        return;
      }

      if (req.currentUser.userType === EnumNotifyUserType.Agent) {
        res.status(200).send(await _agentFlow(req.currentUser));
        return;
      }

      res.status(200).send(await _companyFlow(req.currentUser));
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as getAgentRouter };

const _agentFlow = async (currentUser: INotifyUser) => {
  const agents = await AgentModel.find({
    owner: currentUser.owner,
    enabled: true,
  })
    .populate('profile')
    .lean();

  return agents.filter((agent) => String(agent._id) !== currentUser._id);
};

const _companyFlow = (currentUser: INotifyUser) => {
  return AgentModel.find({
    owner: currentUser._id,
  })
    .populate('profile')
    .lean();
};
