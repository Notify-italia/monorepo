import {
  EnumNotifyStatType,
  EnumNotifyUserType,
  INotifyStat,
  INotifyUser,
} from '@notify/interfaces';
import { requestHandler } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.request';
import { Router } from 'express';
import { query } from 'express-validator';
import { Types } from 'mongoose';
import { AgentModel } from '../../../models/model.agent';
import { STAT_VALIDATION_MESSAGES } from '../../../models/model.stat';
import { StatManager } from '../../../services/service.stat';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('type')
    .custom((v) => Object.values(EnumNotifyStatType).includes(v))
    .withMessage(STAT_VALIDATION_MESSAGES.type as string),
  query('owner')
    .optional()
    .isMongoId()
    .withMessage(STAT_VALIDATION_MESSAGES.owner as string),
  query('from')
    .isISO8601()
    .custom((v, { req }) => new Date(v) < new Date(req.query?.to))
    .withMessage(STAT_VALIDATION_MESSAGES.period as string),
  query('to')
    .isISO8601()
    .custom((v, { req }) => new Date(v) > new Date(req.query?.from))
    .withMessage(STAT_VALIDATION_MESSAGES.period as string),
  requestHandler(
    async (req, res) => {
      const { type, owner } = req.query as unknown as INotifyStat;

      const period: INotifyStat['period'] = {
        from: new Date(req.query.from as unknown as string),
        to: new Date(req.query.to as unknown as string),
      };

      const user = req.currentUser;

      if (user.userType === EnumNotifyUserType.Company) {
        res.status(200).send(await _companyFlow(type, owner, period, user));
        return;
      }

      res.status(200).send(await _agentFlow(type, period, user));
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as getStatRouter };

const _companyFlow = async (
  type: EnumNotifyStatType,
  owner: INotifyUser['_id'],
  period: INotifyStat['period'],
  user: INotifyUser
) => {
  //assegno l'array, con l'owner se presente, altrimenti vuoto
  let agents: Types.ObjectId[] = owner ? [new Types.ObjectId(owner)] : [];

  if (!owner) {
    //se non ho un owner, cerco tutti gli agenti che hanno come owner l'utente
    agents = (await AgentModel.find({ owner: user._id }))?.map(
      (agent) => agent._id
    );
  }

  return await StatManager.report({
    type,
    owner: { $in: agents },
    $and: [
      { 'period.from': { $gte: period.from } },
      { 'period.to': { $lte: period.to } },
    ],
  });
};

const _agentFlow = async (
  type: EnumNotifyStatType,
  period: INotifyStat['period'],
  user: INotifyUser
) => {
  //get all documents that start no sooner than period.from or end no later than period.to
  return await StatManager.report({
    type,
    owner: user._id,
    $and: [
      { 'period.from': { $gte: period.from } },
      { 'period.to': { $lte: period.to } },
    ],
  });
};
