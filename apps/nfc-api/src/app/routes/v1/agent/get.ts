import { EnumNotifyUserType, INotifyUser } from '@notify/interfaces';
import {
  AGENT_VALIDATION_MESSAGES,
  AgentDocument,
  AgentModel,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';
import { FilterQuery, isValidObjectId } from 'mongoose';

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
  requestHandler(
    async (req, res) => {
      const { id } = req.query;

      if (id) {
        res
          .status(200)
          .send(await _getPopulatedAgent({ _id: (id as string).split(',') }));
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
  const agents = await _getPopulatedAgent({
    owner: currentUser.owner,
    enabled: true,
  });

  return agents.filter((agent) => String(agent._id) !== currentUser._id);
};

const _companyFlow = async (currentUser: INotifyUser) => {
  return await _getPopulatedAgent({
    owner: currentUser._id,
  });
};

const _getPopulatedAgent = async (query: FilterQuery<AgentDocument>) => {
  return await AgentModel.find(query)
    .populate({
      path: 'profile',
      populate: 'note',
    })
    .lean();
};
