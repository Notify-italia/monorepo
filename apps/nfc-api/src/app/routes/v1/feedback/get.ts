import { EnumNotifyUserType } from '@notify/interfaces';
import { requestHandler } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.request';
import { Router } from 'express';
import { query } from 'express-validator';
import { FilterQuery } from 'mongoose';
import { AgentModel } from '../../../models/model.agent';
import {
  FeedbackDocument,
  FeedbackModel,
} from '../../../models/model.feedback';
import { STAT_VALIDATION_MESSAGES } from '../../../models/model.stat';
import { BadRequestError } from '../../../services/errors/errors';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
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
    .custom(
      (v, { req }) =>
        new Date(v) > new Date(req.query?.from) && new Date(v) < new Date()
    )
    .withMessage(STAT_VALIDATION_MESSAGES.period as string),
  requestHandler(
    async (req, res) => {
      //get the owner, from and to from the request query
      const { owner, from, to } = req.query;

      //get all the agents that belong to the company
      const companyAgents = await AgentModel.find({
        owner: req.currentUser._id,
      })
        .select('_id')
        .lean();

      const params: FilterQuery<FeedbackDocument> = {
        createdAt: {
          $gte: from,
          $lte: to,
        },
        owner: {
          $in: companyAgents.map((agent) => agent._id),
        },
      };

      if (
        owner &&
        !companyAgents.find(
          (agent) => agent._id.toString() === owner.toString()
        )
      ) {
        throw new BadRequestError(
          'Stai cercando di accedere a feedback di un agente che non ti appartiene.'
        );
      }

      if (owner) {
        //if the owner is present, add it to the params, overwriting the previous owner
        params.owner = owner;
      }

      //get all the feedbacks that match the params
      res.send(await FeedbackModel.find(params).lean());
    },
    {
      requireAuth: {
        requireLicense: true,
      },
      permittedRoles: [EnumNotifyUserType.Company],
    }
  )
);

export { router as getFeedbackRouter };
