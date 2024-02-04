import { EnumNotifyStatType } from '@notify/interfaces';
import { Router } from 'express';
import { body } from 'express-validator';
import { AgentModel } from '../../../models/model.agent';
import {
  FEEDBACK_VALIDATION_MESSAGES,
  FeedbackModel,
} from '../../../models/model.feedback';
import { errorHandledRequest } from '../../../services/errors/middlewares/bun.error-handler';

const router = Router();

router.post(
  '/',
  body('owner')
    .isMongoId()
    .withMessage(FEEDBACK_VALIDATION_MESSAGES.owner as string),
  body('rating')
    .isNumeric()
    .withMessage(FEEDBACK_VALIDATION_MESSAGES.rating as string),
  body('comment')
    .optional()
    .isString()
    .withMessage(FEEDBACK_VALIDATION_MESSAGES.comment as string),
  errorHandledRequest(async (req, res) => {
    const { owner, rating, comment } = req.body;

    const feedback = FeedbackModel.build({
      owner,
      rating,
      comment,
    });

    await feedback.save();

    await _upStats(owner, rating);

    res.status(201).send(feedback.toObject());
  })
);

export { router as postFeedbackRouter };

const _upStats = async (owner: string, rating: number) => {
  const agent = await AgentModel.findOne({ _id: owner });

  if (!agent) {
    return;
  }

  const count =
    (agent.statsTotals[EnumNotifyStatType.ProfileFeedbackCount] || 0) + 1;
  const totalRating =
    agent.statsTotals[EnumNotifyStatType.ProfileFeedbackTotalRating] || 0;

  agent.statsTotals[EnumNotifyStatType.ProfileFeedbackCount] = count;
  agent.statsTotals[EnumNotifyStatType.ProfileFeedbackTotalRating] =
    rating + totalRating;

  agent.markModified('statsTotals');

  agent.save();
};
