import { EnumNotifyUserType } from '@notify/interfaces';
import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { Router } from 'express';
import { query } from 'express-validator';
import { FilterQuery } from 'mongoose';
import {
  FeedbackDocument,
  FeedbackModel,
} from '../../../models/model.feedback';
import { STAT_VALIDATION_MESSAGES } from '../../../models/model.stat';

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
  errorHandledRequest(
    async (req, res) => {
      //get the owner, from and to from the request query
      const { owner, from, to } = req.query;

      const params: FilterQuery<FeedbackDocument> = {
        createdAt: {
          $gte: from,
          $lte: to,
        },
      };

      if (owner) {
        params.owner = owner;
      }

      const feedback = await FeedbackModel.find(params).lean();

      res.send(feedback);
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
